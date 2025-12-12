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

    // Abrir/cerrar panel al hacer click
    btnNoti.addEventListener("click", (e) => {
        e.stopPropagation(); // evita que el click cierre el panel
        panelNoti.classList.toggle("hidden");
    });

    // Cerrar si se hace click fuera
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
        const data = await res.json(); // lista de notificaciones
        // Actualizar badge con la cantidad
        let noLeidas = 0 
        data.forEach(noti => {
          if (noti.read == false){
            noLeidas = noLeidas+1
          }
        })
        actualizarBadge(noLeidas);
        // Actualizar lista del panel
        const lista = document.getElementById("lista-notificaciones");
        lista.innerHTML = "";
        if (data.length === 0) {
            lista.innerHTML = `<li>No hay notificaciones nuevas.</li>`;
        } else {
        data.forEach(noti => {
        const li = document.createElement("li");
        li.classList.remove("bg-blue-100", "text-gray-600");
        li.classList.add("bg-blue-300", "text-blue-900");

        
        li.className = `
        notificacion p-2 rounded mb-2 border-l-4 cursor-pointer flex justify-between items-center
        ${noti.read ? "bg-blue-300 text-blue-900" : "bg-blue-100 text-gray-600"}
    `;
    li.innerHTML = noti.title ?? "Notificación";



    const noLeida = document.createElement("button");
    noLeida.className ="ml-3 px-2 py-1 text-blue-600 hover:text-blue-800 font-bold"
    noLeida.textContent = "O";
   // noLeida.classList.add("flex-1");
    noLeida.addEventListener("click", () => marcarUnaComoLeida(noLeida, noti._id));

    const btnEliminar = document.createElement("button");
    btnEliminar.innerHTML = "X";
    btnEliminar.className =
        "ml-3 px-2 py-1 text-red-600 hover:text-red-800 font-bold";
    btnEliminar.addEventListener("click", (e) => {
        e.stopPropagation();
        eliminarNotificacion(noti._id);
    });
    li.appendChild(noLeida);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
});
        }

} catch (err) {
        console.error("Error cargando notificaciones:", err);
    }}

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
        li.className = noti.read ? "text-gray-500" : "text-white font-semibold";
        lista.appendChild(li);
    });
}
async function marcarComoLeidas() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://back-nest-xi.vercel.app/notifications/read" , {
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            cargarNotificaciones(); // para refrescar el panel
        }

    } catch (err) {
        console.error("Error al marcar como leídas", err);
    }
}


async function send() {
  try {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const token = localStorage.getItem("token");

    const nuevaNotificacion = {
      title : title,
      description : description,
      read : false
    }
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

function noLeidas() {
  const div = document.createElement("div");

  div.className = `notificacion ${noLeidas.read ? "leida" : "no-leida"}`;

  div.innerHTML = `
    <h4>${n.title}</h4>
    <p>${n.message}</p>
    <button onclick="marcarComoLeida('${noLeidas.id}', this)">Marcar como leída</button>
  `;

  return div;
}

async function marcarUnaComoLeida(boton, id) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://back-nest-xi.vercel.app/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      console.error("Error al marcar como leída");
      return;
    }

    const div = boton.closest(".notificacion");
    div.classList.remove("no-leida");
    div.classList.add("leida");

    boton.remove(); 

    btnNoti.addEventListener("click", (e) => {
    e.stopPropagation();
    panelNoti.classList.toggle("hidden"); 
});

  } catch (error) {
    console.error("Error marcando como leído:", error);
  }
}

async function eliminarNotificacion(id) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://back-nest-xi.vercel.app/notifications/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            console.error("Error al eliminar notificación");
            return;
        }

        cargarNotificaciones();

    } catch (error) {
        console.error("Error eliminando notificación:", error);
    }
}
