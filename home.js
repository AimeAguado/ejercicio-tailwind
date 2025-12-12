document.addEventListener("DOMContentLoaded", function () {
  const userGuardado = JSON.parse(localStorage.getItem("user"));
      if (userGuardado && userGuardado) {
        document.getElementById("saludo").textContent = `Hola ${userGuardado.name}`;
    } else {
        document.getElementById("saludo").textContent = "Hola invitado";
    }


  cargarUsers();
  
const close = document.getElementById("closeModal");
  const modal = document.getElementById("myModal");


close.addEventListener("click", () => {
  modal.style.display = "none";
});


// Cerrar clickeando afuera
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
});



async function cargarUsers() {
  const token = await localStorage.getItem("token")
  fetch("https://back-nest-xi.vercel.app/users", {
      method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      mostrarTabla(data);
    })
    .catch(err => console.error("Error:", err));
}

function mostrarTabla(usuarios) {
  const tbody = document.querySelector("#aime tbody");
  tbody.innerHTML = ""; 

  usuarios.forEach(user => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.lastname}</td>
      <td>${user.email}</td>
      <td>
        <button class="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded" onclick="borrarUsuario('${user._id}')">
          Borrar
        </button>
        <button class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded" onclick="mostrarModal('${user._id}')">
          Editar
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

async function borrarUsuario(id) {

  try {
    const token = await localStorage.getItem("token")
    const res = await fetch(`https://back-nest-xi.vercel.app/users/${id}`, {
      method: "DELETE",
      headers: {
            "Authorization": "Bearer " + token
        },
    });

    if (res.ok){
      alert("Usuario borrado correctamente");
      // el usuario se borro
      cargarUsers()
    }

    

  } catch (err) {
    console.error("Error borrando usuario:", err);
  }
}

async function mostrarModal(id) {
  const modal = document.getElementById("myModal");
  modal.style.display = "flex";
  try{
    const token = await localStorage.getItem("token")
    const res = await fetch(`https://back-nest-xi.vercel.app/users/${id}`, {
      headers: {
      "Authorization": "Bearer " + token }
    })
  if (res.ok){
    const usuario = await res.json();
    console.log(usuario)
    document.getElementById("email").value = usuario.email;
    document.getElementById("nombre").value = usuario.name;
    document.getElementById("apellido").value = usuario.lastname;
    document.getElementById("usuarioId").value = id;
  }
  } catch (err) {
    console.error("Error borrando usuario:", err);
  }
}

async function editForm() {
  try{ 
    const id = document.getElementById("usuarioId").value
    const name = document.getElementById("nombre").value;
    const lastname = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const modal = document.getElementById("myModal");
    const usuarioEditado = {
      name,
      lastname,
      email
    }
    const token = await localStorage.getItem("token")
    const res = await fetch(`https://back-nest-xi.vercel.app/users/${id}`,  {
            method: "PUT",
            headers: {
              "Authorization": "Bearer " + token ,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarioEditado)
        })
        if (res.ok){
          alert("Usuario editado")
          modal.style.display = "none";
          cargarUsers()
        }
  } catch (err) {
    console.error("Error editando usuario:", err);
  }
  
}

document.addEventListener("DOMContentLoaded", function (){
    const btnNoti = document.getElementById("btn-notification");
    const panelNoti = document.getElementById("notificaciones");


    btnNoti.addEventListener("click", (e) => {
        e.stopPropagation(); 
        panelNoti.classList.toggle("hidden");
        marcarComoLeidas()
    });

    document.addEventListener("click", (e) => {
        if (!panelNoti.contains(e.target)) {
            panelNoti.classList.add("hidden");
        }
    });
    cargarNotificaciones(); 
});

async function cargarNotificaciones() {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://back-nest-xi.vercel.app/notifications", {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) {
            console.error("Error al obtener notificaciones");
            return;
        }

        const data = await res.json();

       
        const noLeidas = data.filter(noti => !noti.read).length;
        actualizarBadge(noLeidas);

        
        renderNotificaciones(data);

    } catch (err) {
        console.error("Error cargando notificaciones:", err);
    }
}


function actualizarBadge(cantidad) {
    const badge = document.getElementById("badge");

    if (cantidad > 0) {
        badge.textContent = cantidad;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}

function llenarPanel(notificaciones) {
    const lista = document.getElementById("lista-notificaciones");
    lista.innerHTML = "";

    if (notificaciones.length === 0) {
        lista.innerHTML = "<li>No hay notificaciones.</li>";
        return;
    }

    notificaciones.forEach(noti => {
        const li = document.createElement("li");
        li.textContent = noti.message;
        li.className = noti.read ? "text-blue-500" : "text-white font-semibold";
        lista.appendChild(li);
    });
}
async function marcarComoLeidas() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://back-nest-xi.vercel.app/notifications/read" , {
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + token 
            }
        });

        if (res.ok) {
            actualizarBadge(0);
            cargarNotificaciones(); 
        }


    } catch (err) {
        console.error("Error al marcar como leídas", err);
    }
}

function renderNotificaciones(notificaciones) {
    const lista = document.getElementById("lista-notificaciones");
    lista.innerHTML = "";

    if (notificaciones.length === 0) {
        lista.innerHTML = `<li class="text-gray-400 text-sm p-3">No hay notificaciones.</li>`;
        return;
    }

    notificaciones.forEach(noti => {
        const li = document.createElement("li");

        li.className = `
            flex justify-between items-center p-3 rounded-lg cursor-pointer 
            transition
            ${noti.read 
                ? "bg-white hover:bg-blue-100 text-gray-600" 
                : "bg-blue-50 hover:bg-blue-100 text-black font-semibold"}
        `;

        li.innerHTML = `
            <div>
                <p>${noti.title}</p>
                <p class="text-sm text-gray-500">${noti.description ?? ""}</p>
            </div>

            <div class="flex gap-3 items-center">
                <button 
                    onclick="marcarUnaComoLeida('${noti._id}')"
                    class="w-3 h-3 rounded-full 
                    ${noti.read ? "bg-gray-400" : "bg-blue-600"}">
                </button>

                <button 
                    onclick="borrarNotificacion('${noti._id}')"
                    class="text-red-500 hover:text-red-700 text-lg font-bold">
                    ×
                </button>
            </div>
        `;

        lista.appendChild(li);
    });
}

async function borrarNotificacion(id) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://back-nest-xi.vercel.app/notifications/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.ok) {
            cargarNotificaciones();
        }
    } catch (err) {
        console.error("Error eliminando notificación", err);
    }
}


async function marcarUnaComoLeida(id) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://back-nest-xi.vercel.app/notifications/${id}/read`, {
            method: "PATCH",
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.ok) {
            cargarNotificaciones();
        }

    } catch (err) {
        console.error("Error marcando notificación como leída", err);
    }
}

async function send() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    
    const nuevaNotificacion = {
        title : title,
        description : description,
        read : false
    }
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("https://back-nest-xi.vercel.app/notifications", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevaNotificacion)
    });
      if (res.ok) {
        cargarNotificaciones();
      }
    const data = await res.json();
    console.log("Notificaciones:", data);

  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
  }

}