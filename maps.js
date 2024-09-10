const apiKey = 'c1b97a608c35465dab8112346240809';
const baseUrl = 'http://api.weatherapi.com/v1';

// Initialize the map
const map = L.map('weather-map').setView([51.505, -0.09], 13); // Default view to London

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a marker for testing
L.marker([51.5, -0.09])
    .addTo(map)
    .bindPopup('A test marker.')
    .openPopup();

// Function to fetch weather data and update the map
function getWeatherLocation(location) {
    fetch(`${baseUrl}/current.json?key=${apiKey}&q=${location}`)
        .then(response => response.json())
        .then(data => {
            const lat = data.location.lat;
            const lon = data.location.lon;
            const weatherCondition = data.current.condition.text;
            const weatherIcon = `https:${data.current.condition.icon}`;

            // Set the view of the map to the location
            map.setView([lat, lon], 10);

            // Add a marker for the location
            L.marker([lat, lon])
                .addTo(map)
                .bindPopup(`<strong>${data.location.name}</strong><br>${weatherCondition}<br><img src="${weatherIcon}" alt="Weather icon">`)
                .openPopup();
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Handle the search button click
document.getElementById('searchButton').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value.trim();
    if (location) {
        getWeatherLocation(location);
    } else {
        alert('Please enter a city name');
    }
});

// 
document.getElementById('locationInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = e.target.value.trim();
        if (location) {
            getWeatherLocation(location);
        } else {
            alert('Please enter a city name');
        }
    }
});

// Fetch default weather data for a default location
document.addEventListener('DOMContentLoaded', () => {
    getWeatherLocation('Colombo');
});
