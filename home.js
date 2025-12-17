document.addEventListener("DOMContentLoaded", () => {
  // ===== SALUDO =====
  const user = JSON.parse(localStorage.getItem("user"));
  const saludo = document.getElementById("saludo");
  saludo.textContent = user?.name ? `Hola ${user.name}` : "Hola invitado";

  // ===== NOTIFICACIONES =====
  const btnNoti = document.getElementById("btn-notification");
  const panelNoti = document.getElementById("notificaciones");

  btnNoti.addEventListener("click", (e) => {
    e.stopPropagation();
    panelNoti.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!panelNoti.contains(e.target) && !btnNoti.contains(e.target)) {
      panelNoti.classList.add("hidden");
    }
  });

  cargarUsers();
  cargarNotificaciones();
});

// ================= USERS =================

async function cargarUsers() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://back-nest-xi.vercel.app/users", {
    headers: { Authorization: "Bearer " + token }
  });

  const users = await res.json();
  renderTabla(users);
}

function renderTabla(users) {
  const tbody = document.querySelector("#aime tbody");
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.className = "border-b";

    tr.innerHTML = `
      <td class="p-2">${user.name}</td>
      <td class="p-2">${user.lastname}</td>
      <td class="p-2">${user.email}</td>
      <td class="p-2 flex gap-2">
        <button 
          class="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded"
          onclick="borrarUsuario('${user._id}')">
          Borrar
        </button>
        <button 
          class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded"
          onclick="mostrarModal('${user._id}')">
          Editar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function borrarUsuario(id) {
  const token = localStorage.getItem("token");

  await fetch(`https://back-nest-xi.vercel.app/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  cargarUsers();
}

// ================= MODAL =================

async function mostrarModal(id) {
  document.getElementById("myModal").classList.remove("hidden");

  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://back-nest-xi.vercel.app/users/${id}`,
    { headers: { Authorization: "Bearer " + token } }
  );

  const user = await res.json();

  usuarioId.value = id;
  nombre.value = user.name;
  apellido.value = user.lastname;
  email.value = user.email;
}

function cerrarModal() {
  document.getElementById("myModal").classList.add("hidden");
}

async function editForm() {
  const token = localStorage.getItem("token");
  const id = usuarioId.value;

  await fetch(`https://back-nest-xi.vercel.app/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: nombre.value,
      lastname: apellido.value,
      email: email.value
    })
  });

  cerrarModal();
  cargarUsers();
}

// ================= NOTIFICACIONES =================

async function cargarNotificaciones() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "https://back-nest-xi.vercel.app/notifications",
    { headers: { Authorization: "Bearer " + token } }
  );

  const data = await res.json();
  actualizarBadge(data.filter(n => !n.read).length);
  renderNotificaciones(data);
}

function actualizarBadge(cantidad) {
  const badge = document.getElementById("badge");
  badge.textContent = cantidad;
  badge.classList.toggle("hidden", cantidad === 0);
}

function renderNotificaciones(notificaciones) {
  const lista = document.getElementById("lista-notificaciones");
  lista.innerHTML = "";

  if (!notificaciones.length) {
    lista.innerHTML = `
      <li class="p-4 text-gray-400 text-sm">
        No hay notificaciones
      </li>
    `;
    return;
  }

  notificaciones.forEach(noti => {
    const li = document.createElement("li");

    li.className = `
      p-4 hover:bg-gray-50 dark:hover:bg-black/20 transition-colors
      ${noti.read ? "opacity-70" : ""}
    `;

    li.innerHTML = `
      <div class="flex gap-3">

        <!-- ICONO -->
        <div class="
          size-8 rounded-full
          ${noti.read
            ? "bg-gray-200 dark:bg-gray-700 text-gray-500"
            : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"}
          flex items-center justify-center shrink-0
        ">
          <span class="material-symbols-outlined text-[18px]">
            person_add
          </span>
        </div>

        <!-- CONTENIDO -->
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium text-text-main dark:text-white leading-tight">
            ${noti.title}
          </p>
          <p class="text-xs text-text-sub dark:text-gray-400">
            ${noti.description ?? ""}
          </p>

          <!-- ACCIONES -->
          <div class="flex gap-2 pt-1">
            <button
              onclick="marcarUnaComoLeida('${noti._id}')"
              class="
                text-[10px] font-bold uppercase tracking-wide
                px-3 py-1 rounded-full
                ${noti.read
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-default"
                  : "bg-primary text-black hover:bg-yellow-400"}
                transition-colors
              "
              ${noti.read ? "disabled" : ""}
            >
              Read
            </button>

            <button
              onclick="eliminarNotificacion('${noti._id}')"
              class="
                text-[10px] font-bold uppercase tracking-wide
                px-3 py-1 rounded-full
                bg-gray-100 dark:bg-gray-800
                text-text-sub
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors
              "
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    `;

    lista.appendChild(li);
  });
}


async function marcarUnaComoLeida(id) {
  const token = localStorage.getItem("token");

  await fetch(
    `https://back-nest-xi.vercel.app/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token }
    }
  );

  cargarNotificaciones();
}

async function eliminarNotificacion(id) {
  const token = localStorage.getItem("token");

  await fetch(
    `https://back-nest-xi.vercel.app/notifications/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    }
  );

  cargarNotificaciones();
}
