const socket = io.connect();

// Al agregar items recibo el evento 'listMensajes' y actualizo la interface.
socket.on('listMensajes', data => { renderMensajes(data) });

async function renderMensajes(data) {
  const { chat, porcentaje } = data;
  const archivo = await fetch('plantillas/mensajes.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({ mensajes: chat.mensajes, porcentaje: porcentaje });
  document.getElementById('mensajes').innerHTML = result;
}

// Agregar un nuevo mensaje.
function addMensaje(e) {
  const inputNombre = document.getElementById('nombre');
  const inputApellido = document.getElementById('apellido');
  const inputEmail = document.getElementById('email');
  const inputEdad = document.getElementById('edad');
  const inputAlias = document.getElementById('alias');
  const inputAvatar = document.getElementById('avatar');
  const inputMensaje = document.getElementById('mensaje');

  if (inputNombre.value == '' || inputMensaje.value == '') {
    alert('Por favor complete el formulario para enviar un mensaje.')
  } else {
    const dt = new Date();
    const fecha = `${
    (dt.getMonth()+1).toString().padStart(2, '0')}/${
    dt.getDate().toString().padStart(2, '0')}/${
    dt.getFullYear().toString().padStart(4, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`;
    
    const newMensaje = {
      mensaje: inputMensaje.value,
      fecha: fecha,
      autor: {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        email: inputEmail.value,
        edad: inputEdad.value,
        alias: inputAlias.value,
        avatar: inputAvatar.value,  
      }
    };
    agregarMensaje('http://localhost:8080/api/mensajes', newMensaje)
    .then(() => {
      socket.emit('postMensaje');
      inputMensaje.value = '';
      inputMensaje.focus();
    }).catch(error => {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }
  return false;
}

// Funcion para hacer el POST de mensaje
async function agregarMensaje(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

async function clearMensajes() {
  const response = await fetch("http://localhost:8080/api/mensajes/borrar", {
    method: 'DELETE',
  });
  socket.emit('postMensaje');
  return response.json();
}