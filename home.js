document.addEventListener("DOMContentLoaded", function () {
  cargarUsers();
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
        <button class="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded"
                onclick="borrarUsuario('${user._id}')">
          Borrar
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

async function borrarUsuario(id) {

  try {
    const res = await fetch(`https://back-nest-xi.vercel.app/users/delete/${id}`, {
      method: "DELETE"
    });

    alert("Usuario borrado correctamente");

  } catch (err) {
    console.error("Error borrando usuario:", err);
  }
}
