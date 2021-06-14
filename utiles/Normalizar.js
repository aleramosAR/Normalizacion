import { normalize, denormalize, schema } from "normalizr";

// Defino los Schemas
const autorSchema = new schema.Entity("autores", {}, { idAttribute: "email" });

const mensajesSchema = new schema.Entity("mensajes", {
  autor: autorSchema,
},{
  idAttribute: "fecha"
});

const chatSchema = new schema.Entity("chat", {
  mensajes: [mensajesSchema]
})

// Funcion que toma los datos originales y los devuelve normalizados.
export const normalizarMensajes = (originalData) => {

  const normalizedData = normalize(originalData, chatSchema);
  
  console.log("Data original", JSON.stringify(originalData).length);
  console.log("Data normalizada", JSON.stringify(normalizedData).length);

  return normalizedData;
}

// Funcion que toma los mensajes normalizados y los devuelve desnormalizados.
export const desnormalizarMensajes = (normalizedData) => {

  const denormalizedData = denormalize(normalizedData.result, chatSchema, normalizedData.entities);

  const normLength = JSON.stringify(normalizedData).length;
  const denormLength = JSON.stringify(denormalizedData).length;
  
  console.log("Data normalizada", normLength);
  console.log("Data desnormalizada", denormLength);
  
  global.porcentaje = ((normLength / denormLength) * 100).toFixed(2);

  return denormalizedData;
  
}