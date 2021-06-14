import fs from 'fs';
import { normalizarMensajes, desnormalizarMensajes } from '../utiles/Normalizar.js'

class MensajesController {
  constructor() {
    this.mensajesLOG = './public/log/mensajes.json';
    this.CHAT = {
      id: "0",
      mensajes: []
    };

    (async () => { await this.read(); })();
  }

  async create(data) {
    if (data.autor.nombre === "" || typeof data.autor.nombre === "undefined") return false;
    if (data.mensaje === "" || typeof data.mensaje === "undefined") return false;
    this.CHAT.mensajes.push(data);
    this.saveFile(this.CHAT);
    return true;
  }

  async read() {
    const saved = await this.loadFile();
    if (saved) {
      this.CHAT = saved;
    }
    return this.CHAT;
  }

  async clear() {
    this.CHAT.mensajes = []
    this.saveFile(this.CHAT);
    return true;
  }

  // Cargo los datos del TXT
  async loadFile() {
    try {
      if (fs.existsSync(this.mensajesLOG)) {
        const data = JSON.parse(await fs.promises.readFile(this.mensajesLOG, 'utf8'));
        const mensajesDesnormalizados = desnormalizarMensajes(data);
        return mensajesDesnormalizados;
      } else {
        return false;
      }
    } catch(err) {
      return false;
    }
  }

  // Grabo los datos al TXT
  async saveFile(mensajes) {
    const mensajesNormalizados = normalizarMensajes(mensajes);
    try {
      await fs.promises.writeFile(this.mensajesLOG, JSON.stringify(mensajesNormalizados, null, "\t"));
    } catch(err) {
      console.log(err);
    }
  }

}


export default new MensajesController();