import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer, { diskStorage, MulterError } from "multer";
import { extname as _extname } from "path";
import * as fs from "node:fs/promises";
import * as WorkerController from "./controllers/WorkersController.js";

// mongoose
//   .connect(
//     "mongodb+srv://investvesko:psOaRrCJ813mnSYD@cluster0.qxpgtnc.mongodb.net/phone_security?retryWrites=true&w=majority"
//   )
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB is ok");
  })
  .catch((e) => {
    console.log("DB is error", e);
  });

const UPLOADS_FOLDER = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

// Настройка хранилища для Multer
const storage = diskStorage({
  destination: (req, file, cb) => {
    // Укажите директорию для загрузки файлов
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    // Переименуйте файл для предотвращения конфликтов имен
    cb(null, file.fieldname + "-" + Date.now() + _extname(file.originalname));
  },
});

// Инициализация Multer с указанным хранилищем и ограничениями
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение на размер файла 5MB
  fileFilter: (req, file, cb) => {
    // Разрешение только на загрузку изображений
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(_extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

// Маршрут для загрузки файла
app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: "Файл загружен успешно!",
      file: req.file,
    });
  } else {
    res.status(400).json({
      message: "Ошибка при загрузке файла.",
    });
  }
});

// Обработка ошибок Multer
app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    res.status(500).json({ message: err.message });
  } else if (err) {
    res.status(500).json({ message: err.message });
  } else {
    next();
  }
});

app.post("/worker", WorkerController.create);
app.post("/worker/:id/gadgets", WorkerController.addGadget);
app.delete("/worker/:id/gadgets/:gadgetId", WorkerController.removeGadget);
app.get("/worker", WorkerController.getAll);
app.get("/worker/:id", WorkerController.getOne);
app.delete("/worker/:id", WorkerController.removeWorker);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
