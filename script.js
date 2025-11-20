async function login() {
    // obtener los valores de los campos de entrada
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // validar los campos de entrada
    if (email === "" || password === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }
    // fetch

    try {
        const response = await fetch("https://back-nest-xi.vercel.app/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        // navegar a home.html
        if (response.ok) {
            window.location.href = "home.html";
        } else {
            const errorData = await response.json();
            alert("Error de inicio de sesión: " + errorData.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo más tarde.");
        return;
    }
    // 
}

function abriForm() {
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
}

async function register() {
    // obtener los valores de los campos 
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const name = document.getElementById("nombre").value;
    const lastname = document.getElementById("apellido").value;
    const countryCode = document.getElementById("country").value;

    // armar el objeto
    const nuevoUsuario = {
        email,
        password,
        name,
        lastname,
        countryCode
    }
    console.log(nuevoUsuario)
    // fetch POST a "https://back-nest-xi.vercel.app/register"
    try {
        const response = await fetch("https://back-nest-xi.vercel.app/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoUsuario)
        });
        // navegar a home.html
        if (response.ok) {
            window.location.href = "home.html";
        } else {
            const errorData = await response.json();
            alert("Error de registro de usuario " + errorData.message);
        }
    } catch (error) {
        console.error("Error during register", error);
        alert("Ocurrió un error durante el registro de usuario. Por favor, inténtelo de nuevo más tarde.");
        return;
    }
}
async function cargarPaises() {
    try {
        const response = await fetch("https://back-nest-xi.vercel.app/countries")

        if (response.ok) {
            const paises = await response.json();
            console.log("paises", paises)
            const selectPaises = document.getElementById("country")
            // recorrer ese array
            for(const pais of paises) {
                const option = document.createElement("option");
                option.value = pais.code;
                option.textContent = pais.name;
                selectPaises.appendChild(option);
            }
        }
    } catch (error) {
        console.error("Error during loading countries:", error);
        alert("Ocurrió un error durante el cargado de los paises");
        return;
    }
}


document.addEventListener("DOMContentLoaded", function () {
  cargarPaises(); // tu función
});