const apiKey = 'c1b97a608c35465dab8112346240809';
const baseUrl = 'http://api.weatherapi.com/v1';

// Function to fetch historical weather data
function getHistoricalWeather(location) {
    const today = new Date();
    
    // Clear existing weather cards
    document.getElementById('weather-cards').innerHTML = '';

    // Fetch weather data for the past 3 days
    for (let i = 1; i <= 3; i++) {
        let pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i);
        let formattedDate = pastDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        
        // Construct API URL for historical weather
        let url = `${baseUrl}/history.json?key=${apiKey}&q=${location}&dt=${formattedDate}`;
        
        // Fetch data from WeatherAPI
        fetch(url)
            .then(response => response.json())
            .then(data => displayWeather(data, formattedDate))
            .catch(error => console.error('Error fetching weather data:', error));
    }
}

// Function to display the weather data
function displayWeather(data, date) {
    const weatherCardsContainer = document.getElementById('weather-cards');

    const weatherCard = document.createElement('div');
    weatherCard.classList.add('col-md-4', 'mb-4');

    // Extract data from the API response
    const location = data.location.name;
    const temp = data.forecast.forecastday[0].day.avgtemp_c;
    const condition = data.forecast.forecastday[0].day.condition.text;
    const humidity = data.forecast.forecastday[0].day.avghumidity;
    const icon = data.forecast.forecastday[0].day.condition.icon;

   
    weatherCard.innerHTML = `
        <div class="card">
            <img src="https:${icon}" class="card-img-top" alt="Weather icon">
            <div class="card-body">
                <h5 class="card-title">${location} - ${date}</h5>
                <p class="card-text"><strong>Condition:</strong> ${condition}</p>
                <p class="card-text"><strong>Temperature:</strong> ${temp}°C</p>
                <p class="card-text"><strong>Humidity:</strong> ${humidity}%</p>
            </div>
        </div>
    `;

  
    weatherCardsContainer.appendChild(weatherCard);
}


function handleSearch() {
    const location = document.getElementById('locationInput').value.trim();
    if (location) {
        getHistoricalWeather(location);
    } else {
        getHistoricalWeather('Colombo');
    }
}


document.getElementById('searchButton').addEventListener('click', handleSearch);

document.getElementById('locationInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Fetch default weather data for Colombo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getHistoricalWeather('Colombo');
});
