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
        const response = await fetch("https://back-nest-xi.vercel.app" , {
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

}
function cargarPaises() {
//fetch("")
}

cargarPaises();