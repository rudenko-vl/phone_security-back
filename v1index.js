// mongoose
  //   .connect(process.env.MONGODB_URI)

//   import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import multer, { diskStorage, MulterError } from "multer";
// import { extname as _extname } from "path";
// import * as WorkerController from "./controllers/WorkersController.js";

// mongoose
//   .connect(
//     "mongodb+srv://investvesko:psOaRrCJ813mnSYD@cluster0.qxpgtnc.mongodb.net/phone_security?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     console.log("DB is ok");
//   })
//   .catch((e) => {
//     console.log("DB is error", e);
//   });

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use("/uploads", express.static("uploads"));

// const PORT = process.env.PORT || 3000;

// const storage = diskStorage({
//   destination: (req, file, cb) => {
   
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now() + _extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(_extname(file.originalname).toLowerCase());

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only images are allowed!"));
//     }
//   },
// });

// app.post("/upload", upload.single("image"), (req, res) => {
//   if (req.file) {
//     res.status(200).json({
//       message: "Файл загружен успешно!",
//       file: req.file,
//     });
//   } else {
//     res.status(400).json({
//       message: "Ошибка при загрузке файла.",
//     });
//   }
// });

// app.use((err, req, res, next) => {
//   if (err instanceof MulterError) {
//     res.status(500).json({ message: err.message });
//   } else if (err) {
//     res.status(500).json({ message: err.message });
//   } else {
//     next();
//   }
// });

// app.post("/worker", WorkerController.create);
// app.post("/worker/:id/gadgets", WorkerController.addGadget);
// app.delete("/worker/:id/gadgets/:gadgetId", WorkerController.removeGadget);
// app.get("/worker", WorkerController.getAll);
// app.get("/worker/:id", WorkerController.getOne);
// app.delete("/worker/:id", WorkerController.removeWorker);

// app.listen(PORT, () => {
//   console.log(`Сервер запущен на http://localhost:${PORT}`);
// });
