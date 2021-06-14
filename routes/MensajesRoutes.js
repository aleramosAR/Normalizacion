import express from "express";
import Mensajes from '../controllers/MensajesController.js'

const router = express.Router();
router.use(express.json());

router.get("/", async(req, res) => {
  try {
    const mensajes = await Mensajes.read();
    res.status(200).json(mensajes);
  } catch (err) {
    return res.status(404).json({
      error: "No hay mensajes cargados.",
    });
  }
});

router.post("/", async(req, res) => {
  try {
    const newMensaje = req.body;
    await Mensajes.create(newMensaje);
    res.status(201).json(newMensaje);
  } catch (err) {
    res.status(400).send();
  }
});

router.delete("/borrar", async(req, res) => {
  try {
    await Mensajes.clear();
    res.status(200).json({ mensaje: "mensajes eliminados" });
  } catch (err) {
    res.status(400).send();
  }
});

export default router;