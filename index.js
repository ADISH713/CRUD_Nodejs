// require("dotenv").config();

// const fs = require("node:fs/promises");
// const path = require("node:path");
// const { randomUUID } = require("node:crypto");

// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");



// const app = express();
// const USERS_FILE = path.join(__dirname, "user.json");

// async function readUSer() {
//     const data = await fs.readFile(USERS_FILE, "utf8");
//     return JSON.parse(data)
// }

// async function writeUsers(users) {
//     await fs.writeFile(
//         USERS_FILE, JSON.stringify(users, null, 2), "utf8"
//     )
// }

// app.use(helmet())
// app.use(cors())
// app.use(express.json())
// app.use(morgan("dev"))

// const limiter = rateLimit({
//     windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),
//     limit: Number(process.env.RATE_LIMIT_MAX),
//     standardHeaders: "draft-8",
//     legacyHeaders: false,

//       handler: (req, res) => {
//         return res.status(429).json({
//         success: false,
//         message: "Too many requests. Please try again later.",
//         });
//     },

// })

// app.use(limiter);

// app.get("/", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "User CRUD API is running"
//     })
// });

// app.post("/users", async (req, res, next) => {
//     try {
//         const { name, email, age } = req.body || {}
//         if (typeof name !== "string" || name.length < 2) {
//             return res.status(400).json({ success: false, message: "Name must constains minimum of 2 chars" })
//         }
//         if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
//             return res.status(400).json({ success: false, message: "Enter a valid email" })
//         }
//         if (age !== undefined && (typeof age !== "number" || !Number.isFinite(age))) {
//             return res.status(400).json({ success: false, message: "Enter a valid age", });
//         }

//         const users = await readUSer()

//         const cleanedEmail = email.trim().toLowerCase();

//         const existingUser = users.find((user) => user.email.toLowerCase() === cleanedEmail)

//         if (existingUser) {
//             return res.status(409).json({ success: false, message: "Email already exist" })
//         }

//         const now = new Date().toISOString();

//         const newUser = {
//             id: randomUUID(),
//             name: name.trim(),
//             email: cleanedEmail,
//             ...(age !== undefined && { age }),
//             createdAt: now,
//             updatedAt: now
//         }
//         users.push(newUser)
//         await writeUsers(users);

//         return res.status(201).json({ success: true, message: "Created succesully", data: newUser })
//     }
//     catch (error) {
//         next(error);
//     }

// })

// app.get("/users", async (req, res, next) => {
//     try {
//         const users = await readUSer();

//         return res.status(200).json({ success: true, data: users })
//     }
//     catch (error) {
//         next(error)
//     }
// })

// app.get("/users/:id", async (req, res, next) => {

//     try {

//         const users = await readUSer();

//         const user = users.find(user => user.id === req.params.id);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }


//         return res.status(200).json({ success: true, data: user })

//     }
//     catch (error) {
//         next(error)
//     }
// })


// app.patch("/users/:id", async (req, res, next) => {
//     try {
//         const { name, email, age } = req.body || {};
//         const users = await readUSer();

//         const index = users.findIndex(
//             (user) => user.id === req.params.id
//         );

//         if (index === -1) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const user = users[index];

//         if (name !== undefined) {
//             if (typeof name !== "string" || name.trim().length < 2) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Name must contain at least 2 characters",
//                 });
//             }
//             user.name = name.trim();
//         }

//         if (email !== undefined) {
//             if (
//                 typeof email !== "string" ||
//                 !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
//             ) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Enter a valid email",
//                 });
//             }

//             const normalizedEmail = email.trim().toLowerCase();

//             const duplicate = users.some(
//                 (item) =>
//                     item.id !== user.id &&
//                     item.email.toLowerCase() === normalizedEmail
//             );

//             if (duplicate) {
//                 return res.status(409).json({
//                     success: false,
//                     message: "Email already exists",
//                 });
//             }

//             user.email = normalizedEmail;
//         }

//         if (age !== undefined) {
//             if (typeof age !== "number" || !Number.isFinite(age)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Age must be a finite number",
//                 });
//             }
//             user.age = age;
//         }

//         user.updatedAt = new Date().toISOString();

//         await writeUsers(users);

//         return res.status(200).json({
//             success: true,
//             message: "User updated successfully",
//             data: user,
//         });
//     } catch (error) {
//         next(error);
//     }
// });


// app.put("/users/:id", async (req, res, next) => {
//     try {
//         const { name, email, age } = req.body || {};

//         const users = await readUSer();

//         const index = users.findIndex(
//             (user) => user.id === req.params.id
//         );

//         if (index === -1) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         if (typeof name !== "string" || name.trim().length < 2) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Name must contain at least 2 characters",
//             });
//         }

//         if (
//             typeof email !== "string" ||
//             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Enter a valid email",
//             });
//         }

//         if (
//             age !== undefined &&
//             (typeof age !== "number" || !Number.isFinite(age))
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Age must be a finite number",
//             });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         const duplicate = users.some(
//             (user) =>
//                 user.id !== req.params.id &&
//                 user.email.toLowerCase() === normalizedEmail
//         );

//         if (duplicate) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Email already exists",
//             });
//         }

//         const existingUser = users[index];
//         const now = new Date().toISOString();

//         const updatedUser = {
//             id: existingUser.id,
//             name: name.trim(),
//             email: normalizedEmail,
//             ...(age !== undefined && { age }),
//             createdAt: existingUser.createdAt,
//             updatedAt: now,
//         };

//         users[index] = updatedUser;

//         await writeUsers(users);

//         return res.status(200).json({
//             success: true,
//             message: "User replaced successfully",
//             data: updatedUser,
//         });
//     } catch (error) {
//         next(error);
//     }
// });


// app.delete("/users/:id", async (req, res, next) => {
//     try {
//         const users = await readUSer();

//         const index = users.findIndex(
//             (user) => user.id === req.params.id
//         );

//         if (index === -1) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const deletedUser = users.splice(index, 1)[0];

//         await writeUsers(users);

//         return res.status(200).json({
//             success: true,
//             message: "User deleted successfully",
//             data: deletedUser,
//         });
//     } catch (error) {
//         next(error);
//     }
// });

// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.method} ${req.originalUrl}`,
//   });
// });

// app.use((err, req, res, next) => {
//   console.error(err);

//   if (res.headersSent) {
//     return next(err);
//   }

//   const status = err.status || err.statusCode || 500;

//   return res.status(
//     status >= 400 && status < 600 ? status : 500
//   ).json({
//     success: false,
//     message: status >= 500
//       ? "Internal server error"
//       : err.message,
//   });
// });

// const PORT = Number(process.env.PORT) || 5000;

// app.listen(PORT, () => {
//     console.log(`server is running on http://localhost:${PORT}`)
// })