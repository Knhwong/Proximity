let longitude;
let latitude;


const form = document.getElementById('form');
const input = document.getElementById('input');
const connect = document.getElementById('connect');
const inputButton = document.getElementById("inputButton");

input.disabled = true;
inputButton.disabled = true;
const socket = io();
getLocation();

connect.addEventListener('click', () => {
    console.log("Umm");
    socket.emit('connectGeo', { "long": longitude, "lat": latitude })
    console.log(`Connecting: ${longitude} ${latitude}`)
})

socket.on('connectGeo', (res) => {
    console.log(res)
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', {
            'msg': input.value,
            "long": longitude,
            "lati": latitude,
            "timestamp": new Date()
        });
        input.value = '';
    }
});


socket.on('chat message', (msg) => {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});



function getLocation() {
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                longitude = position.coords.longitude;
                latitude = position.coords.latitude;
                input.disabled = false;
                inputButton.disabled = false;

                console.log(`Longitude: ${longitude}$ \n Latitude: ${latitude}`)
                socket.emit('LongLat', {
                    'longitude': longitude,
                    'latitude': latitude,
                })
            })
        } else {
            input.disabled = true;
            inputButton.disabled = true;
            throw new Error("Error: Geolocation not supported by this browser")
        }
    } catch (error) {
        console.error(`${error}`)
    }
}