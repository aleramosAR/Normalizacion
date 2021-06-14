import express from "express";
import handlebars from "express-handlebars";
import fetch from "node-fetch";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import mensRoutes from "./routes/MensajesRoutes.js";
import frontRoutes from "./routes/FrontRoutes.js";

const PORT = 8080;
const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

global.porcentaje = 0;

app.use(express.static("public"));

// Funcion que devuelve el listado de mensajes
async function getMensajes() {
	try {
		const response = await fetch("http://localhost:8080/api/mensajes");
		io.sockets.emit("listMensajes", { chat: await response.json(), porcentaje: global.porcentaje });
	} catch (err) {
		console.log(err);
	}
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", frontRoutes);
app.use("/api/mensajes", mensRoutes);

app.engine("hbs", handlebars({
    extname: "hbs",
    defaultLayout: "layout.hbs"
  })
);

app.set("views", "./views");
app.set("view engine", "hbs");

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado!");
	getMensajes();

	/* Escucho los mensajes enviado por el cliente y se los propago a todos */
	socket.on("postMensaje", data => {
		getMensajes();
	}).on('disconnect', () => {
		console.log('Usuario desconectado')
	});
});

// Conexion a server con callback avisando de conexion exitosa
httpServer.listen(PORT, () => { console.log(`Ya me conecte al puerto ${PORT}.`); })
.on("error", (error) => console.log("Hubo un error inicializando el servidor.") );