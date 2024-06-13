// Set the Cesium Ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3OWFiYTk2YS05ODNjLTRhOGMtYjAxMi1hZTZlNTBiZjhhNjciLCJpZCI6MjIwMjE2LCJpYXQiOjE3MTc1Nzc1MjZ9.YlTuNHJxUCMwExzJ6lFkXv2whLH8llfgBtPSBtCpzFE';

// Initialize the Cesium Viewer
var viewer = new Cesium.Viewer('cesiumContainer');

// Create a ScreenSpaceEventHandler
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

// OpenWeatherMap API key
var openWeatherApiKey = '';

// Set up the click event handler
handler.setInputAction(function (movement) {
    // Get the Cartesian coordinates of the click position
    var cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
    if (cartesian) {
        // Convert Cartesian to Cartographic coordinates
        var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
        // Convert radians to degrees
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        
        // Log the coordinates
        console.log('Latitude: ' + latitude + ', Longitude: ' + longitude);
        
        // Fetch weather data
        fetchWeatherData(latitude, longitude);

        // Fetch location data
        fetchLocationData(latitude, longitude);

        // Display coordinates
        displayCoordinates(latitude, longitude);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Function to fetch weather data
function fetchWeatherData(latitude, longitude) {
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data:', data);
            displayWeatherData(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to fetch location data
function fetchLocationData(latitude, longitude) {
    var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Location data:', data);
            displayLocationData(data);
        })
        .catch(error => console.error('Error fetching location data:', error));
}

// Function to display weather data
function displayWeatherData(data) {
    var description = data.weather[0].description;
    var temperature = data.main.temp - 273.15; // Convert from Kelvin to Celsius

    // Get the current content of the info div and update it with weather data
    var infoDiv = document.getElementById('info');
    var currentText = infoDiv.innerText;
    infoDiv.innerText = currentText + `\nWeather: ${description}\nTemperature: ${temperature.toFixed(2)}°C`;
}

// Function to display location data
function displayLocationData(data) {
    var location = data.display_name;

    // Get the current content of the info div and update it with location data
    var infoDiv = document.getElementById('info');
    var currentText = infoDiv.innerText;
    infoDiv.innerText = currentText + `\nLocation: ${location}`;
}

// Function to display coordinates
function displayCoordinates(latitude, longitude) {
    // Update the info div with coordinates
    var infoDiv = document.getElementById('info');
    infoDiv.innerText = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
}
