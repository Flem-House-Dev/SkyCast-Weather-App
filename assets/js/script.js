// Vars ----------------------------------------
let cityInputEl = $('#city-input'); 
let citySelectFormEl = $('#city-select');
let savedCityInputEl = $('#saved-cities');

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

            let printedCityName = data[0].name;
            localStorage.setItem('printedCity', JSON.stringify(printedCityName));
            $('#current-city').text(printedCityName);

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


// ---------------------------------------------------------------------------------

function updateSavedCities(cityName) {
    if (cityName !== null && cityName !== undefined) {
        let savedCities = JSON.parse(localStorage.getItem("savedCities"));

        if (!Array.isArray(savedCities)) {
            savedCities = [];
        }

        savedCities.push(cityName);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
       
        $('#saved-cities').empty();
        
        for (i = 0; i < savedCities.length; i++) {

        let addSearchHist = $.parseHTML(`
        <option value = "${savedCities[i]}">${savedCities[i]}</option>`)

        
        $('#saved-cities').append(addSearchHist);
        }
   
     
        // loadSavedCities(cityName);
    }
}

// ---------------------------------------------------------------------------------

function loadSavedCities() {
    
    let savedCities = JSON.parse(localStorage.getItem("savedCities"));
    if (!Array.isArray(savedCities)) {
        savedCities = [];
    }
    for (i = 0; i < savedCities.length; i++) {

        let addSearchHist = $.parseHTML(`
            <option value = "${savedCities[i]}">${savedCities[i]}</option>
        `)
       
        $('#saved-cities').append(addSearchHist);
    }

}

// ---------------------------------------------------------------------------------

function apiCalls(city) {

    getCoordingates(city, function () {
        $('#results-container').fadeIn("slow");
    });
}

// ---------------------------------------------------------------------------------

citySelectFormEl.on('submit', function (event) {

    event.preventDefault();
    let selectedOption = $('.city-input').val();

    if (selectedOption !== "") {
        localStorage.setItem('selectedCity', JSON.stringify(selectedOption));
        updateSavedCities(selectedOption);

        apiCalls(selectedOption);
        $('#city-input').val("");
    }
});



// -----------------------------------------------

savedCityInputEl.on('input', function(event) {

    event.preventDefault();
    let selectedOption = $('#saved-cities').val();

    console.log("dropdown selected option ...........................");
    console.log(selectedOption);

        localStorage.setItem('selectedCity', JSON.stringify(selectedOption));
        // updateSavedCities(selectedOption);
        console.log(" ...........................");
        apiCalls(selectedOption);
        $('#city-input').val("");
    

})



// -----------------------------------------------

$(document).ready(function () {
    let savedCity = JSON.parse(localStorage.getItem('selectedCity'));
    let printedCity = JSON.parse(localStorage.getItem('printedCity'));
    apiCalls(savedCity, printedCity);

    loadSavedCities();

});

// --------------------------------------------------------------