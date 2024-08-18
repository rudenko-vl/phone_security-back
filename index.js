import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as UserController from "./controllers/UserController.js";

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

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.post("/users", UserController.create);
app.post("/users/:id/gadgets", UserController.addGadget);
app.delete("/users/:id/gadgets/:gadgetId", UserController.removeGadget);
app.get("/users", UserController.getAll);
app.get("/users/:id", UserController.getOne);
app.delete("/users/:id", UserController.removeWorker);
app.put("/users/:id", UserController.updateUser);
app.put("/users/:id/gadgets/:gadgetId", UserController.updateGadget);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
