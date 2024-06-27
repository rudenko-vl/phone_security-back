// import WorkersModel from "../models/Worker.js";

// export const create = async (req, res) => {
//   try {
//     const doc = new WorkersModel({
//       name: req.body.name,
//       position: req.body.position || "",
//       imgUrl: req.body.imgUrl || "",
//       gadgets: req.body.gadgets || [],
//     });
//     const person = await doc.save();
//     res.json(person);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не вдалось створити",
//     });
//   }
// };

// export const removeWorker = async (req, res) => {
//   try {
//     const person = await WorkersModel.findByIdAndDelete(req.params.id);
//     if (!person) {
//       return res.status(404).json({ message: "Пользователь не найден" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не вдалось отримати",
//     });
//   }
// };

// export const getAll = async (req, res) => {
//   try {
//     const persons = await WorkersModel.find().exec();
//     res.json(persons);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не вдалось отримати",
//     });
//   }
// };

// export const getOne = async (req, res) => {
//   try {
//     const personId = req.params.id;
//     const person = await WorkersModel.findById(personId);
//     res.json(person);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не вдалось отримати",
//     });
//   }
// };

// export const addGadget = async (req, res) => {
//   try {
//     const worker = await WorkersModel.findById(req.params.id);
//     if (!worker) {
//       return res.status(404).json({ message: "Пользователь не найден" });
//     }
//     worker.gadgets.push({
//       title: req.body.title,
//       brand: req.body.brand,
//       model: req.body.model,
//       sn: req.body.sn,
//       imgUrl: req.body.imgUrl || "",
//     });
//     await worker.save();
//     res.status(201).json(worker);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const removeGadget = async (req, res) => {
//   try {
//     const worker = await WorkersModel.findById(req.params.id);
//     if (!worker) {
//       return res.status(404).json({ message: "Пользователь не найден" });
//     }
//     worker.gadgets.id(req.params.gadgetId).deleteOne();
//     await worker.save();
//     res.status(200).json(worker);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// router.put("/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!user) {
//       return res.status(404).json({ message: "Пользователь не найден" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
