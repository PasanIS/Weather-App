let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("city");
let forecastContainer = document.getElementById("forecast-cards");
let unitBtn = document.getElementById("unit-btn");
let apiKey = "c1b97a608c35465dab8112346240809";
let baseUrl = "http://api.weatherapi.com/v1";

let isMetric = true; //----Default to metric units

//----Function to convert metric to imperial
const convertToImperial = (tempC, windKph) => {
    let tempF = (tempC * 9 / 5) + 32;
    let windMph = windKph / 1.609;
    return {
        tempF: tempF.toFixed(1),
        windMph: windMph.toFixed(1)
    };
};

// -----Function to set the background image based on weather condition and time of day
const setBackground = (condition, isDay) => {
    let imagePath = "images/";

    // -----Check if it's day or night
    if (isDay === 1) {
        // -----Day time backgrounds
        switch (condition.toLowerCase()) {
            case "clear":
            case "sunny":
                imagePath += "clear.jpg";
                break;
            case "cloudy":
            case "partly cloudy":
                imagePath += "cloudy.jpg";
                break;
            case "rain":
            case "rainy":
                imagePath += "rainy.jpg";
                break;
            case "snow":
            case "snowy":
                imagePath += "snowy.jpg";
                break;
            default:
                imagePath += "clear.jpg";
        }
    } else {
        // -----Night time backgrounds
        switch (condition.toLowerCase()) {
            case "clear":
            case "sunny":
                imagePath += "clear_night.jpg";
                break;
            case "cloudy":
            case "partly cloudy":
                imagePath += "cloudy_night.jpg";
                break;
            case "rain":
            case "rainy":
                imagePath += "rainy_night.jpg";
                break;
            case "snow":
            case "snowy":
                imagePath += "snowy_night.jpg";
                break;
            default:
                imagePath += "clear_night.jpg";
        }
    }

    // -----Set the background image
    document.body.style.backgroundImage = `url('${imagePath}')`;
};

// ------Function to fetch and display weather
let getWeather = () => {
    let cityValue = cityRef.value || "Colombo"; // -----Default to Colombo if input is empty
    let url = `${baseUrl}/forecast.json?key=${apiKey}&q=${cityValue}&days=3&aqi=no&alerts=yes`;

    cityRef.value = "";

    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            let localDate = new Date(data.location.localtime);
            let date = localDate.toLocaleDateString();
            let time = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let currentTemp = isMetric ? `${data.current.temp_c} &#176;C` : `${convertToImperial(data.current.temp_c).tempF} &#176;F`;
            let feelsLike = isMetric ? `${data.current.feelslike_c} &#176;C` : `${convertToImperial(data.current.feelslike_c).tempF} &#176;F`;
            let windSpeed = isMetric ? `${data.current.wind_kph} kph` : `${convertToImperial(0, data.current.wind_kph).windMph} mph`;

            // -----Set the background based on weather
            let currentCondition = data.current.condition.text;
            let isDay = data.current.is_day;
            setBackground(currentCondition, isDay);

            result.innerHTML = `
                <h2>${data.location.name}, ${data.location.country}</h2>
                <h4>${data.current.condition.text}</h4>
                <img src="https:${data.current.condition.icon}" alt="weather icon">
                <h1>${currentTemp}</h1>
                <p>${date}</p>
                <p>${time}</p>
                <p>Feels Like: ${feelsLike}</p>
                <p>Wind Speed: ${windSpeed}</p>
                <p>Humidity: ${data.current.humidity}%</p>
                <p>UV Index: ${data.current.uv}</p>
            `;

            forecastContainer.innerHTML = "";
            data.forecast.forecastday.forEach(day => {
                let maxTemp = isMetric ? `${day.day.maxtemp_c} &#176;C` : `${convertToImperial(day.day.maxtemp_c).tempF} &#176;F`;
                let minTemp = isMetric ? `${day.day.mintemp_c} &#176;C` : `${convertToImperial(day.day.mintemp_c).tempF} &#176;F`;

                forecastContainer.innerHTML += `
                    <div class="forecast-card">
                        <h4>${new Date(day.date).toLocaleDateString()}</h4>
                        <img src="https:${day.day.condition.icon}" alt="weather icon">
                        <p><strong>Condition:</strong> ${day.day.condition.text}</p>
                        <p><strong>Max Temp:</strong> ${maxTemp}</p>
                        <p><strong>Min Temp:</strong> ${minTemp}</p>
                        <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
                    </div>
                `;
            });

            // -----Display weather alerts
            let alertSection = document.getElementById("weather-alerts");

            if (data.alerts && data.alerts.alert.length > 0) {
                alertSection.innerHTML = "";
                data.alerts.alert.forEach(alert => {
                    alertSection.innerHTML += `
                        <div class="alert">
                            <h4>${alert.headline}</h4>
                            <p><strong>Severity:</strong> ${alert.severity}</p>
                            <p><strong>Description:</strong> ${alert.desc}</p>
                            <p><strong>Effective:</strong> ${alert.effective}</p>
                            <p><strong>Expires:</strong> ${alert.expires}</p>
                        </div>
                    `;
                });
            } else {
                alertSection.innerHTML = "<p>No active alerts or notifications at this moment.</p>";
            }
        })
        .catch(() => {
            result.innerHTML = `<h3 class="msg">City not found</h3>`;
            forecastContainer.innerHTML = "";
            document.getElementById("weather-alerts").innerHTML = "";
        });
};

// -------Add event listener for unit toggle button
unitBtn.addEventListener("click", () => {
    isMetric = !isMetric;
    unitBtn.textContent = isMetric ? "Switch to Imperial" : "Switch to Metric";
    getWeather();
});

searchBtn.addEventListener("click", getWeather);
window.addEventListener("load", getWeather);