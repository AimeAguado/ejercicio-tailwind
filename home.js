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
                onclick="borrarUsuario('${user.id}')">
          Borrar
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function borrarUsuario(id) {
  if (!confirm("¿Seguro que quieres borrar este usuario?")) return;

  fetch(`https://back-nest-xi.vercel.app/users/${users}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al borrar usuario");
      return res.json();
    })
    .then(() => {
      alert("Usuario borrado correctamente");
      cargarUsers();
    })
    .then(() => {
      const fila = btn.closest("tr");
      fila.remove();
      alert("Usuario borrado correctamente");
    })
    .catch(err => console.error("Error:", err));
}

