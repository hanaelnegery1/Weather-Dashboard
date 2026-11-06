const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const message = document.getElementById("message");
const weatherContent = document.getElementById("weather-content");

const currentCity = document.getElementById("current-city");
const currentDate = document.getElementById("current-date");
const currentTemp = document.getElementById("current-temp");
const currentCondition = document.getElementById("current-condition");
const currentFeels = document.getElementById("current-feels");
const currentIcon = document.getElementById("current-icon");

const detailHumidity = document.getElementById("detail-humidity");
const detailWind = document.getElementById("detail-wind");
const detailIcon = document.getElementById("detail-icon");
const detailCondition = document.getElementById("detail-condition");
const forecastList = document.getElementById("forecast-list");
const suggestionsList = document.getElementById("suggestions");

let typingTimer;
let latestQuery = "";

const weatherCodes = {
  0: { text: "Clear sky", icon: "☀️" },
  1: { text: "Mainly clear", icon: "🌤️" },
  2: { text: "Partly cloudy", icon: "⛅" },
  3: { text: "Overcast", icon: "☁️" },
  45: { text: "Fog", icon: "🌫️" },
  48: { text: "Freezing fog", icon: "🌫️" },
  51: { text: "Light drizzle", icon: "🌦️" },
  53: { text: "Drizzle", icon: "🌦️" },
  55: { text: "Heavy drizzle", icon: "🌦️" },
  56: { text: "Freezing drizzle", icon: "🌦️" },
  57: { text: "Heavy freezing drizzle", icon: "🌦️" },
  61: { text: "Light rain", icon: "🌧️" },
  63: { text: "Rain", icon: "🌧️" },
  65: { text: "Heavy rain", icon: "🌧️" },
  66: { text: "Freezing rain", icon: "🌧️" },
  67: { text: "Heavy freezing rain", icon: "🌧️" },
  71: { text: "Light snow", icon: "❄️" },
  73: { text: "Snow", icon: "❄️" },
  75: { text: "Heavy snow", icon: "❄️" },
  77: { text: "Snow grains", icon: "❄️" },
  80: { text: "Light rain showers", icon: "🌦️" },
  81: { text: "Rain showers", icon: "🌦️" },
  82: { text: "Heavy rain showers", icon: "🌧️" },
  85: { text: "Snow showers", icon: "🌨️" },
  86: { text: "Heavy snow showers", icon: "🌨️" },
  95: { text: "Thunderstorm", icon: "⛈️" },
  96: { text: "Thunderstorm with hail", icon: "⛈️" },
  99: { text: "Heavy thunderstorm with hail", icon: "⛈️" },
};

function getWeatherInfo(code) {
  return weatherCodes[code] || { text: "Unknown", icon: "🌡️" };
}

function showMessage(text, isError) {
  message.textContent = text;
  message.classList.remove("hidden");
  if (isError) {
    message.classList.add("error");
  } else {
    message.classList.remove("error");
  }
}

function hideMessage() {
  message.classList.add("hidden");
}

async function fetchPlaces(name, count) {
  const geoUrl =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(name) +
    "&count=" +
    count +
    "&language=en&format=json";
  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error(
      "The city search service is not working right now. Please try again later.",
    );
  }

  const geoData = await geoResponse.json();

  return geoData.results || [];
}

async function findCity(city) {
  const places = await fetchPlaces(city, 1);

  if (places.length === 0) {
    throw new Error(
      'We could not find "' + city + '". Check the spelling and try again.',
    );
  }

  return places[0];
}

function startLoading() {
  latestQuery = "";
  clearTimeout(typingTimer);
  hideSuggestions();
  showMessage("Loading weather...", false);
  searchButton.disabled = true;
}

function showError(error) {
  weatherContent.classList.add("hidden");

  if (error.name === "TypeError") {
    showMessage(
      "Network problem. Please check your internet connection and try again.",
      true,
    );
  } else {
    showMessage(error.message, true);
  }
}

async function searchCity() {
  const city = cityInput.value.trim();

  if (city === "") {
    showMessage("Please enter a city name.", true);
    weatherContent.classList.add("hidden");
    return;
  }

  startLoading();

  try {
    const place = await findCity(city);
    await loadPlace(place);
  } catch (error) {
    showError(error);
  } finally {
    searchButton.disabled = false;
  }
}

async function selectPlace(place) {
  cityInput.value = place.name;
  startLoading();

  try {
    await loadPlace(place);
  } catch (error) {
    showError(error);
  } finally {
    searchButton.disabled = false;
  }
}

async function loadPlace(place) {
  const weatherData = await getWeather(place.latitude, place.longitude);

  displayWeather(place, weatherData.current);
  displayForecast(weatherData.daily);

  hideMessage();
  weatherContent.classList.remove("hidden");
}

function hideSuggestions() {
  suggestionsList.classList.add("hidden");
  suggestionsList.innerHTML = "";
}

function displaySuggestions(places) {
  suggestionsList.innerHTML = "";

  for (let i = 0; i < places.length; i++) {
    const place = places[i];

    let placeText = place.country;
    if (place.admin1) {
      placeText = place.admin1 + ", " + place.country;
    }

    const name = document.createElement("span");
    name.classList.add("suggestion-name");
    name.textContent = place.name;

    const details = document.createElement("span");
    details.classList.add("suggestion-place");
    details.textContent = placeText;

    const button = document.createElement("button");
    button.type = "button";
    button.appendChild(name);
    button.appendChild(details);
    button.addEventListener("click", function () {
      selectPlace(place);
    });

    const item = document.createElement("li");
    item.appendChild(button);
    suggestionsList.appendChild(item);
  }

  suggestionsList.classList.remove("hidden");
}

async function showSuggestions() {
  const name = cityInput.value.trim();

  if (name.length < 2) {
    hideSuggestions();
    return;
  }

  latestQuery = name;

  try {
    const places = await fetchPlaces(name, 5);

    if (name !== latestQuery) {
      return;
    }

    if (places.length === 0) {
      hideSuggestions();
    } else {
      displaySuggestions(places);
    }
  } catch (error) {
    hideSuggestions();
  }
}

async function getWeather(latitude, longitude) {
  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
    "&timezone=auto";

  const response = await fetch(weatherUrl);

  if (!response.ok) {
    throw new Error(
      "We could not load the weather data. Please try again later.",
    );
  }

  return await response.json();
}

function displayWeather(place, current) {
  const info = getWeatherInfo(current.weather_code);

  currentCity.textContent = place.name + ", " + place.country;

  const date = new Date(current.time);
  currentDate.textContent =
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  currentTemp.textContent = Math.round(current.temperature_2m) + "°C";
  currentCondition.textContent = info.text;
  currentFeels.textContent =
    "Feels like " + Math.round(current.apparent_temperature) + "°C";
  currentIcon.textContent = info.icon;

  detailHumidity.textContent = current.relative_humidity_2m + "%";
  detailWind.textContent = current.wind_speed_10m + " km/h";
  detailIcon.textContent = info.icon;
  detailCondition.textContent = info.text;
}

function displayForecast(daily) {
  forecastList.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const info = getWeatherInfo(daily.weather_code[i]);

    const date = new Date(daily.time[i] + "T00:00:00");
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const card = document.createElement("div");
    card.classList.add("card", "forecast-day");
    card.innerHTML =
      '<span class="forecast-name">' +
      dayName +
      "</span>" +
      '<span class="forecast-date">' +
      dayDate +
      "</span>" +
      '<span class="forecast-icon" title="' +
      info.text +
      '">' +
      info.icon +
      "</span>" +
      '<span class="forecast-max">' +
      Math.round(daily.temperature_2m_max[i]) +
      "°</span>" +
      '<span class="forecast-min">' +
      Math.round(daily.temperature_2m_min[i]) +
      "°</span>";

    forecastList.appendChild(card);
  }
}

searchButton.addEventListener("click", searchCity);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCity();
  } else if (event.key === "Escape") {
    hideSuggestions();
  }
});

cityInput.addEventListener("input", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(showSuggestions, 300);
});

document.addEventListener("click", function (event) {
  if (!event.target.closest(".search-box")) {
    hideSuggestions();
  }
});
