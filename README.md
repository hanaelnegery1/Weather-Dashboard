<div align="center">
  <img src="assets/images/weather.svg" alt="Weather Dashboard logo" width="140">

<h1>Weather Dashboard</h1>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-1C64F2?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://open-meteo.com/)

</div>

A responsive weather dashboard that lets users search for cities around
the world and view current weather conditions and a 5-day forecast.

## Features

-   Search for cities by name.
-   Show city suggestions while typing, including region and country.
-   Display current temperature, weather condition, date, and local
    time.
-   Display feels-like temperature, humidity, and wind speed.
-   Show a 5-day forecast with weather conditions and daily high and low
    temperatures.
-   Use weather codes to display matching weather descriptions and emoji
    icons.
-   Show loading, validation, and error messages.
-   Provide a responsive layout for desktop, tablet, and mobile screens.

## Technologies

| Technology | Purpose |
| --- | --- |
| HTML5 | Accessible and semantic page structure |
| CSS3 | Responsive layout, cards, and visual styling |
| Vanilla JavaScript | Search, interaction, and weather rendering |
| Fetch API | Requests for city and weather data |
| Open-Meteo Geocoding API | Finds cities and their coordinates |
| Open-Meteo Forecast API | Provides current weather and forecasts |

## APIs

This project uses the free [Open-Meteo](https://open-meteo.com/)
services. No API key is required.

### Geocoding API

Searches for cities and returns location information, including names,
countries, regions, and geographic coordinates.

``` text
https://geocoding-api.open-meteo.com/v1/search
```

The application uses the selected city's latitude and longitude to
request weather data. Suggestions are fetched while the user types.

## Project Structure

``` text
Weather-Dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── images/
        └── weather.svg
```

## Error Handling

The application handles: - Empty city input. - City names with no
matching results. - Geocoding or weather service errors. - Network
connection problems.

## Notes

-   Temperature is displayed in Celsius.
-   Wind speed is displayed in km/h.
-   Humidity is displayed as a percentage.
-   Weather descriptions and icons are selected using Open-Meteo weather
    codes.

## Data Source

Weather data is provided by [Open-Meteo](https://open-meteo.com/).

------------------------------------------------------------------------

