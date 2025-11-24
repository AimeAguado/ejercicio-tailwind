document.addEventListener("DOMContentLoaded", function () {
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



function cargarUsers() {
  fetch("https://back-nest-xi.vercel.app/users")
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
    const res = await fetch(`https://back-nest-xi.vercel.app/users/${id}`, {
      method: "DELETE"
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
    const res = await fetch(`https://back-nest-xi.vercel.app/users/${id}`)
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
    const res = await fetch(`https://back-nest-xi.vercel.app/users/${id}`,  {
            method: "PUT",
            headers: {
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
