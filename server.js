// const express = require("express");
// const cors = require("cors");
// const nodemailer = require("nodemailer");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// const messagesFile = path.join(__dirname, "messages.json");
// const counterFile = path.join(__dirname, "counter.json");


// // =========================
// // SAVE MESSAGES
// // =========================
// function saveMessage(messageData) {
//   let messages = [];

//   if (fs.existsSync(messagesFile)) {
//     try {
//       const fileData = fs.readFileSync(messagesFile, "utf8");
//       messages = fileData ? JSON.parse(fileData) : [];
//     } catch {
//       messages = [];
//     }
//   }

//   messages.push(messageData);
//   fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), "utf8");
// }


// // =========================
// // VISITOR COUNTER
// // =========================
// function getCounter() {
//   if (!fs.existsSync(counterFile)) {
//     fs.writeFileSync(counterFile, JSON.stringify({ visits: 0 }));
//   }

//   const data = JSON.parse(fs.readFileSync(counterFile));
//   return data.visits;
// }

// function incrementCounter() {
//   let visits = getCounter();
//   visits++;

//   fs.writeFileSync(counterFile, JSON.stringify({ visits }, null, 2));
//   return visits;
// }


// // =========================
// // EMAIL SETUP
// // =========================
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });


// // =========================
// // CONTACT FORM
// // =========================
// app.post("/api/contact", async (req, res) => {
//   try {
//     const { name, email, message } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     const messageData = {
//       name,
//       email,
//       message,
//       createdAt: new Date().toISOString()
//     };

//     saveMessage(messageData);

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_TO,
//       subject: `New Message from ${name}`,
//       replyTo: email,
//       text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
//     });

//     res.json({ message: "Message sent successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to send message." });
//   }
// });


// // =========================
// // VISITOR ROUTES
// // =========================
// require("dotenv").config();

// app.get("/api/visit", (req, res) => {
//   const visits = incrementCounter();
//   res.json({ visits });
// });

// app.get("/api/admin/visits", (req, res) => {
//   const adminKey = req.query.key;

//   if (adminKey !== process.env.ADMIN_KEY) {
//     return res.status(403).json({ error: "Unauthorized" });
//   }

//   const visits = getCounter();
//   res.json({ visits });
// });


// // =========================
// // START SERVER
// // =========================
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// // 
// // npx kill-port 3000
// // node server.js
// //

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const messagesFile = path.join(__dirname, "messages.json");
const counterFile = path.join(__dirname, "counter.json");

/* =========================
   SAVE MESSAGES
========================= */
function saveMessage(messageData) {
  let messages = [];

  if (fs.existsSync(messagesFile)) {
    try {
      const fileData = fs.readFileSync(messagesFile, "utf8");
      messages = fileData ? JSON.parse(fileData) : [];
    } catch {
      messages = [];
    }
  }

  messages.push(messageData);
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), "utf8");
}

/* =========================
   VISITOR COUNTER
========================= */
function getCounter() {
  if (!fs.existsSync(counterFile)) {
    fs.writeFileSync(counterFile, JSON.stringify({ visits: 0 }, null, 2), "utf8");
  }

  try {
    const data = JSON.parse(fs.readFileSync(counterFile, "utf8"));
    return data.visits || 0;
  } catch {
    return 0;
  }
}

function incrementCounter() {
  const visits = getCounter() + 1;
  fs.writeFileSync(counterFile, JSON.stringify({ visits }, null, 2), "utf8");
  return visits;
}

/* =========================
   EMAIL SETUP
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =========================
   CONTACT FORM
========================= */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const messageData = {
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    saveMessage(messageData);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    res.json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

/* =========================
   VISITOR ROUTES
========================= */
app.get("/api/visit", (req, res) => {
  const visits = incrementCounter();
  res.json({ visits });
});

app.get("/api/admin/visits", (req, res) => {
  const adminKey = req.query.key;

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const visits = getCounter();
  res.json({ visits });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});