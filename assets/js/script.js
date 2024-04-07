// Vars ----------------------------------------
let cityInputEl = $('#city-input');
let citySelectFormEl = $('#city-select');
let lat;
let lon;


// ------------------------------------------------------------------

function getCoordingates(city, callback) {

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
            getForecast(lat, lon, callback)
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

// ---------------------------------------------------------------------------------

function getForecast(lat, lon, callback) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=0a2ac5dbbeb08b5bafd134ce15a7e8c5`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log('Get forecast .....................................');
            console.log(data);
            $('#forecast-cards-container').empty();
            for (let i = 0; i < data.list.length; i += 8) {
                let forecast = data.list[i].main
                let day = `Day ${i / 8 + 1}:`;

                // if (i === 0) {
                //     $('.card-text').text(`Temp for the day: ${forecast.temp} ° F`);
                //     let imgSrc = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
                //     $('.card-img-top').attr('src', imgSrc);
                // }

                renderCard($('#forecast-cards-container'), data.list[i]);
                console.log(day, `Low: ${forecast.temp_min}`, `hight: ${forecast.temp_max}`); // Access and print every 8th element
            }

            if (typeof callback == 'function') {
                callback();
            }
        });
};

// ---------------------------------------------------------------------------------

function renderCard(cardsContainer, forecastData) {
    // 1. create elements
    // 2. append data to elements
    // 3. append elements to containers
    let forecastCard = $.parseHTML(`
        <div class="card col-12 col-md-2">
        <img class="card-img-top" src = "" alt = "Title" />
        <div class="card-body">
            <h4 class="card-title">Title</h4>
            <p class="card-text">Text</p>
        </div>
        </div>`);

    let imgSrc = `https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
    $(forecastCard).find(".card-img-top").attr("src", imgSrc);

    $(cardsContainer).append(forecastCard);
}

// ---------------------------------------------------------------------------------

function apiCalls(city, printedCityName) {

    $('#current-city').text(printedCityName);
    getCoordingates(city, function () {
    $('#results-container').slideDown();
    });
}

// ---------------------------------------------------------------------------------

citySelectFormEl.on('submit', function(event) {

    event.preventDefault();
    let selectedOption = $('#city-input option:selected').val();
    localStorage.setItem('selectedCity', JSON.stringify(selectedOption));

    let printedCityName = $('#city-input option:selected').text();
    localStorage.setItem('printedCity', JSON.stringify(printedCityName));

    apiCalls(selectedOption, printedCityName);

});

// -----------------------------------------------

$(document).ready(function () {
    let savedCity = JSON.parse(localStorage.getItem('selectedCity'));
    let printedCity = JSON.parse(localStorage.getItem('printedCity'));
  apiCalls(savedCity, printedCity);
});