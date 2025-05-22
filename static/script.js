// script.js
const API_KEY = "dc37633d41cc5449569dd44893a9c0de";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeather(city);
    saveSearch(city);
  }
});

function fetchWeather(city) {
  fetch(`/api/weather?city=${city}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      const current = data.current;
      const forecastData = data.forecast;

      const currentWeather = `
        <h3>${current.name}</h3>
        <p>${current.weather[0].main} - ${current.weather[0].description}</p>
        <p>Temp: ${current.main.temp} °C</p>
        <p>Humidity: ${current.main.humidity}%</p>
        <p>Wind: ${current.wind.speed} m/s</p>
      `;
      document.getElementById("currentWeather").innerHTML = currentWeather;

      const forecasts = forecastData.list.filter((_, index) => index % 8 === 0);
      const forecastHTML = forecasts.map(item => `
        <div class="card">
          <h4>${new Date(item.dt_txt).toLocaleDateString()}</h4>
          <p>${item.weather[0].main}</p>
          <p>Temp: ${item.main.temp} °C</p>
        </div>
      `).join('');
      document.getElementById("forecastCards").innerHTML = forecastHTML;
    });
}

function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  document.getElementById("searchHistory").innerHTML = history.map(city => `
    <li><button onclick="fetchWeather('${city}')">${city}</button></li>
  `).join('');
}

// Initialize on load
window.onload = renderHistory;
