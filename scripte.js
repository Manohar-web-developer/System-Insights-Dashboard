function updateClock() {

    const now = new Date();

    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    let ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    hour = hour ? hour : 12;

    hour = String(hour).padStart(2, "0");
    minute = String(minute).padStart(2, "0");
    second = String(second).padStart(2, "0");

    document.getElementById("current_time").innerText =
        `${hour} : ${minute} :`;

    document.getElementById("sec").innerText = " " + second;

    if (ampm === "AM") {

        document.getElementById("am")
            .classList.add("activeh2");

        document.getElementById("pm")
            .classList.remove("activeh2");

    } else {

        document.getElementById("pm")
            .classList.add("activeh2");

        document.getElementById("am")
            .classList.remove("activeh2");

    }

    const day = now.getDate();

    const month = now.toLocaleString("default", {
        month: "long"
    });

    const year = now.getFullYear();

    document.getElementById("date").innerText =
        `${day} ${month} ${year}`;

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const currentDay =
        days[now.getDay()];

    document.getElementById("day").innerText =
        currentDay;
    const realHour = now.getHours();
    let greeting = "";

    if (realHour < 12) {

        greeting = "Good Morning";

    }
    else if (realHour < 18) {

        greeting = "Good Afternoon";

    }
    else {

        greeting = "Good Evening";

    }

    document.getElementById("greet").innerText =
        greeting;
}

setInterval(updateClock, 1000);

updateClock();


function updateStatus() {

    if (navigator.onLine) {

        document.getElementById("status_current")
            .innerText = "Online";
        document.getElementById("status_icon").classList.add("active")
        document.getElementById("status_icon").classList.remove("off")
    } else {

        document.getElementById("status_current")
            .innerText = "Offline";
        document.getElementById("status_icon").classList.add("off")
        document.getElementById("status_icon").classList.remove("active")


    }
}

updateStatus();

window.addEventListener(
    "online",
    updateStatus
);

window.addEventListener(
    "offline",
    updateStatus
);

function updateBattery() {
    navigator.getBattery().then((battery) => {

        const level = Math.round(battery.level * 100);

        document.querySelectorAll(".battery-charge").forEach(v => {
            v.innerText = `${level}%`
        });

        let ringColor = "";

        if (level > 80) {
            ringColor = "#22c55e";
            document.querySelectorAll(".battery_status").forEach(v => {
                v.innerHTML = `<i class="fa-solid fa-battery-full green"></i>`
            });
            document.querySelector(".batteryHealth").innerText = "Health: Excellent";

        } else if (level > 50) {
            ringColor = "#ca973a";
            document.querySelectorAll(".battery_status").forEach(v => {
                v.innerHTML = `<i class="fa-solid fa-battery-half yellow"></i>`
            });
            document.querySelector(".batteryHealth").innerText = "Health: Good";

        } else if (level > 20) {
            ringColor = "#f97316";
            document.querySelectorAll(".battery_status").forEach(v => {
                v.innerHTML = `<i class="fa-solid fa-battery-quarter red"></i>`
            });
            document.querySelector(".batteryHealth").innerText = "Health: Average";

        } else {
            ringColor = "#ef4444";
            document.querySelectorAll(".battery_status").forEach(v => {
                v.innerHTML = `<i class="fa-solid fa-battery-empty red"></i>`
            });
            document.querySelector(".batteryHealth").innerText = "Health: Poor";
        }

        document.querySelectorAll(".battery-ring").forEach(ring => {
            ring.style.background = `conic-gradient(
                ${ringColor} ${level}%,
                rgba(255,255,255,0.1) ${level}%
            )`;
        });

        if (battery.charging === true) {
            document.querySelectorAll(".battery_status").forEach(v => {
                v.innerHTML = `<i class="ri-battery-charge-fill green"></i>`
            });
            document.querySelector(".ifcharging").innerHTML =
                `<i class="ri-flashlight-line"></i> Charging`;
        }

    });
}

updateBattery()


function updateNetwork() {
    const netType = navigator.connection.effectiveType.toUpperCase()
    document.querySelector(".net-type").innerText = netType;

    if (netType === "4G") {
        document.querySelector(".net-quality").innerText = "Excellent";
        document.querySelector(".net-status2").innerText = "Strong Connection"
    } else if (netType === "3G") {
        document.querySelector(".net-quality").innerText = "Good";
        document.querySelector(".net-status2").innerText = "Good Connection"

    } else if (netType === "2G") {
        document.querySelector(".net-quality").innerText = "Poor";
        document.querySelector(".net-status2").innerText = "Bed Connection"

    } else {
        document.querySelector(".net-quality").innerText = "No Internet";
        document.querySelector(".net-status2").innerText = "No Internet Connection"

    }

}
updateNetwork();

let lat;
let lon;

function getWeather() {
    navigator.geolocation.getCurrentPosition(
        async function (position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            const API_KEY = "860d213de30eb3f15e277be92735470d";

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

            const response = await fetch(url);
            const data = await response.json();

            document.querySelector(".w-city").innerText = data.name
            document.querySelector(".w-temp").innerText = `${data.main.temp.toFixed(0)} °C`;
            document.querySelector(".w-pill-h").innerText = `H: ${data.main.temp_max.toFixed(0)}`;
            document.querySelector(".w-pill-l").innerText = `L: ${data.main.temp_min.toFixed(0)}`;
            document.querySelector(".w-desc").innerText = `${data.weather[0].description}`;
            document.querySelector(".w-desc").innerText = `${data.weather[0].description}`;
            document.querySelector(".w-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" width="80" height="80" />`

            

        },
        function (error) {
            console.log("Location Not found:", error.message);
        }
    );
}
getWeather()


let map, marker;
let userLat = null, userLng = null;

const purpleIcon = L.divIcon({
    className: '',
    html: `
      <div style="
        width: 20px; height: 20px;
        background: #7c3aed;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #fff;
        box-shadow: 0 0 12px rgba(124,58,237,0.8);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
});

function initMap(lat, lng) {
    if (map) {
        map.setView([lat, lng], 12);
        if (marker) marker.setLatLng([lat, lng]);
        else marker = L.marker([lat, lng], { icon: purpleIcon }).addTo(map);
        return;
    }

    map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: false,
        touchZoom: true,
    }).setView([lat, lng], 3);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
    }).addTo(map);

    marker = L.marker([lat, lng], { icon: purpleIcon }).addTo(map);
}

function getCityName(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(r => r.json())
        .then(data => {
            const addr = data.address;
            const city = addr.city || addr.town || addr.village || addr.county || "Unknown";
            const state = addr.state || "";
            document.getElementById("loc-city").innerText = city;
            document.getElementById("loc-region").innerText = state + ", India";
        })
        .catch(() => {
            document.getElementById("loc-city").innerText = "Location found";
            document.getElementById("loc-region").innerText = `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
        });
}

function openMap() {
    if (userLat && userLng) {
        window.open(`https://maps.google.com/?q=${userLat},${userLng}`, '_blank');
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            userLat = pos.coords.latitude;
            userLng = pos.coords.longitude;
            initMap(userLat, userLng);
            getCityName(userLat, userLng);
        },
        (err) => {
            userLat = 26.2389;
            userLng = 73.0243;
            initMap(userLat, userLng);
            document.getElementById("loc-city").innerText = "Jodhpur";
            document.getElementById("loc-region").innerText = "Rajasthan, India";
            document.getElementById("loc-region").style.color = "#ff6b6b";
            document.getElementById("loc-region").innerText = "Location access denied — showing Jodhpur";
        }
    );
} else {
    document.getElementById("loc-city").innerText = "Not supported";
    document.getElementById("loc-region").innerText = "Browser doesn't support geolocation";
}


async function getQuote() {

    let quote = await fetch("https://dummyjson.com/quotes/random")

    let data = await quote.json();

    console.log(data);

    document.querySelector(".greet_pera").innerText =
    `${data.quote} \n \n Author: ${data.author}`;

}

getQuote();

setInterval(getQuote, 10000);