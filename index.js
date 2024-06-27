const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const UPLOADS_FOLDER = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

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
app.post("/users", upload.single("image"), async (req, res) => {
  try {
    const { name, position } = req.body;
    const image = req.file ? req.file.filename : null;

    const newUser = new User({
      name,
      position: position || "",
      image: image || "",
      gadgets: [],
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Пользователь создан успешно!", user: newUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ошибка при создании пользователя.", error });
  }
});

app.post("/users:id/gadgets", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const { title, brand, model, sn } = req.body;
    const image = req.file ? req.file.filename : null;
    user.gadgets.push({
      title,
      brand,
      model,
      sn,
      image,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Удаление изображений пользователя и гаджетов
    const deleteFiles = [
      user.image,
      ...user.gadgets.map((gadget) => gadget.image),
    ].filter(Boolean);
    await Promise.all(
      deleteFiles.map((file) => {
        const filePath = path.join(UPLOADS_FOLDER, file);
        return fs.promises.unlink(filePath).catch((err) => {
          if (err.code !== "ENOENT") throw err;
        });
      })
    );

    // Удаление пользователя из базы данных
    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ message: "Пользователь и его изображения удалены успешно" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении пользователя", error });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении пользователей.", error });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const person = await User.findById(personId);
    res.json(person);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалось отримати",
    });
  }
});

app.post("/users/:id/gadgets", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, brand, model, sn } = req.body;
    const image = req.file ? req.file.filename : null;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const newGadget = { title, brand, model, sn, image };
    user.gadgets.push(newGadget);
    await user.save();

    res
      .status(201)
      .json({ message: "Гаджет добавлен успешно!", gadget: newGadget });
  } catch (error) {
    res.status(400).json({ message: "Ошибка при добавлении гаджета.", error });
  }
});

// Маршрут для получения всех гаджетов пользователя
app.get("/users/:id/gadgets", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json(user.gadgets);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении гаджетов.", error });
  }
});

// Маршрут для удаления гаджета пользователя
app.delete("/users/:id/gadgets/:gadgetId", async (req, res) => {
  try {
    const { id: userId, gadgetId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const gadget = user.gadgets.id(gadgetId);
    if (!gadget) {
      return res.status(404).json({ message: "Гаджет не найден" });
    }

    // Удаление изображения гаджета
    if (gadget.image) {
      const filePath = path.join(UPLOADS_FOLDER, gadget.image);
      await fs.promises.unlink(filePath).catch((err) => {
        if (err.code !== "ENOENT") throw err;
      });
    }

    // Удаление гаджета
    user.gadgets.id(req.params.gadgetId).deleteOne();
    await user.save();

    res
      .status(200)
      .json({ message: "Гаджет и его изображение удалены успешно" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении гаджета.", error });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
