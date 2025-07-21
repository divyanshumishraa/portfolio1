const apiKey = "890dda8f83a40ecd32ff9518555a5574";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeather(city);
        getForecast(city);
    }
});

async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        document.getElementById("cityName").textContent = data.name;
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("condition").textContent = data.weather[0].main;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("wind").textContent = `${data.wind.speed} km/h`;

        // ✅ Weather icon
const icon = document.getElementById("weatherIcon");
const iconCode = data.weather[0].icon;
const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

icon.src = iconUrl;
icon.alt = data.weather[0].description;
icon.style.display = "inline-block"; // ✅ Show icon only after search


    } catch (error) {
        alert("❌ " + error.message);
    }
}

async function getForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Forecast data not available");

        const data = await res.json();
        console.log("Forecast data:", data);

        const forecastContainer = document.getElementById("forecastContainer");
        forecastContainer.innerHTML = "";

        const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        if (daily.length === 0) {
            forecastContainer.innerHTML = "<p>No forecast data available.</p>";
            return;
        }

        daily.forEach(day => {
            const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
            const temp = Math.round(day.main.temp);
            const condition = day.weather[0].main;
            const iconCode = day.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            const card = document.createElement("div");
            card.classList.add("forecast-card");
            card.innerHTML = `
        <h4>${date}</h4>
        <p>${temp}°C</p>
        <p>${condition}</p>
      `;
            forecastContainer.appendChild(card);

        });

        // ✅ Animate forecast cards
        gsap.from(".forecast-card", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1
        });

    } catch (error) {
        console.error("Forecast error:", error);
        document.getElementById("forecastContainer").innerHTML = `<p style="color:#ff6666;">${error.message}</p>`;
    }
}
