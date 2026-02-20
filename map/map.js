
async function iniciarMapa() {

    const token = await localStorage.getItem("token")
    const response = await fetch("https://back-nest-xi.vercel.app/users/locations", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
    })

    if (response.ok) {
        const ciudades = await response.json();
        const mapa = new google.maps.Map(document.getElementById("map"), {
            zoom: 5,
            center: ciudades[0],
        });

        for (const ciudad of ciudades){
            new google.maps.Marker({
                position: ciudad,
                map: mapa,
                title: ciudad.name
            });
        }
    }   
}

// Botón para volver a home
document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "../index.html"; // ajustalo según tu ruta
});
