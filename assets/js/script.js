// let cityName = "atlanta";
// let stateName = "ga";
let cityInputEl = $('#city-input');
let citySelectFormEl = $('#city-select');

let lat;
let lon;


// getCoordingates(cityName);

function getCoordingates(city) {
    // console.log(city);
    const requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},us&limit=5&appid=0a2ac5dbbeb08b5bafd134ce15a7e8c5`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log('Get coordingates .....................................');
            console.log(data);
            city = data[0].local_names.en;
            lat = data[0].lat;
            lon = data[0].lon;
            console.log(city);
            console.log(lat);
            console.log(lon);

            getCurrentWeather(lat, lon);

        })

};


// ---------------------------------------------------------------------------------
function getCurrentWeather(lat, lon) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=0a2ac5dbbeb08b5bafd134ce15a7e8c5`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log('Get current weather .....................................');
            console.log(data);

            let currentTemp = parseInt(data.main.temp);
            $('#current-temp').text(`Current temp: ${currentTemp}° F`);
        });
};

function handleFormSubmit(event) {
    event.preventDefault();

    const selectedOption = $('#city-input option:selected');
    const selectedText = selectedOption.text().trim();
    $('#current-city').text(selectedText);
    getCoordingates(cityInputEl.val());
}

citySelectFormEl.on('submit', handleFormSubmit);
// -----------------------------------------------

$(document).ready(function () {

});


