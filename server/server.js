const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const { Server } = require("socket.io");
const User = require("./model/model.schema");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'build')));
// Linking to Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.error(error);
  });

// instantiate a new server on this node server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// watching for connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// generating otp logic
let otpCache = {};
function generateOTP() {
  return randomstring.generate({
    length: 4,
    charset: "numeric",
  });
}

// generating otp logic

// otp sending logic
function sendOTP(email, otp) {
  const mailoptions = {
    from: "Chatify <codemaestro101@gmail.com>",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP Verification Number is: ${otp}`,
  };

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, //Disable certificate validation
    },
  });

  transporter.sendMail(mailoptions, (error, info) => {
    if (error) {
      console.log("Error occured:", error);
    } else {
      console.log("OTP Email sent successfully: ", info.response);
    }
  });
}
// otp sending logic

// send invitation
function sendInvitation(username, inviteEmail, roomId) {
  const mailoptions = {
    from: username,
    to: inviteEmail,
    subject: "Chatify Invitation", 
    text: `@${username} is inviting you to a Chatify chat at ${roomId}. Use this link to join the chat: ${process.env.CLIENT_URI}/chat/${randomstring.generate(10)}`
  };

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, //Disable certificate validation
    },
  });

  transporter.sendMail(mailoptions, (error, info) => {
    if (error) {
      console.log("Error occured:", error);
    } else {
      console.log("Message sent successfully: ", info.response);
    }
  });
}

// send invitation

// signup logic
app.post("/api/register", async (req, res) => {
  const { username, email, password: hashedPassword } = req.body;

  const password = await bcrypt.hash(hashedPassword, 10);

  try {
    await User.create({
      username,
      email,
      password,
    });

    const OTP = generateOTP();
    otpCache = { email, OTP };

    sendOTP(email, OTP);
    res.cookie("otpCache", otpCache, {
      maxAge: 30000,
      httpOnly: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        error: "User already exists",
      });
    }

    throw error;
  }

  res.status(200).json({ status: "ok", message: "User Created Successfully" });
});
// signup logic

// otp logic
app.post("/api/otp", async (req, res) => {
  const { otp } = req.body;

  if (otpCache && otpCache.OTP === otp) {
    delete otpCache;
    return res.status(200).json({
      status: "ok",
      message: "OTP verified successfully",
    });
  } else {
    return res.status(400).json({
      status: "error",
      error: "OTP isn't correct",
    });
  }
});
// otp logic

// login logic
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.status(400).json({
      status: "error",
      error: "User not found",
    });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.email,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      status: "ok",
      message: "User verified",
      data: token,
    });
  } else {
    res.status(400).json({
      status: "error",
      error: "Invalid Username/Password",
    });
  }
});
// login logic

// user query
app.post("/api/user-invite", async (req, res) => {
  const { invitedUser, roomId } = req.body;

  const user = await User.findOne({ username:invitedUser }).lean();

  console.log(invitedUser)

  if (!user) {
    res.status(400).json({
      status: "error",
      error: "User doesn't exist",
    });
  }
  
  if (user) {
    const INVITEE_EMAIL = user.email

    sendInvitation(invitedUser, INVITEE_EMAIL,  roomId)

    res.status(200).json({
      status: "ok",
      message: "Email sent to join chat",
    });
  }
});
// user query


// user invite
app.get("/api/chat/:id", async (req, res)=> {

  res.redirect(301, '/chat/*');

  res.status(200).json({
    status: "ok",
    message: "Welcome to this chat"
  })
})
// user invite

//check-invited-username 
app.post("/api/invited-username", async(req, res) => {
  const { username } = req.body

  const user = await User.findOne({ username }).lean()

  if(!user) {
    return res.status(400).json({
      status: 'error',
      error: 'User not found'
    })
  }

  if(user) {
    return res.status(200).json({
      status: 'ok',
      message: 'User found'
    })
  }
})
//check-invited-username 

