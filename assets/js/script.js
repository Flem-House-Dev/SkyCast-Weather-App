// Vars ----------------------------------------
let cityInputEl = $('#city-input'); 
let citySelectFormEl = $('#city-select');
let savedCityInputEl = $('#saved-cities');
let clearSavedListBtnEl = $('#clear-local-storage');

let lat;
let lon;

// ------------------------------------------------------------------

function saveToLocalStorage(saveOurCity) { 
    localStorage.setItem('Saved-To-Storage', JSON.stringify(saveOurCity));
 }

//  function loadFromLocalStorage() {
//     JSON.parse(localStorage.getItem("savedCities"));
//     if (!Array.isArray(loadedCity)) {
//         loadedCity = [];
//     }
//     return loadedCity
//  }

// ------------------------------------------------------------------
function clearSearch() {

    let localSaved = function(){JSON.parse(localStorage.getItem("savedCities"));
        if (!Array.isArray(loadedCity)) {
            loadedCity = [];
        }};

    localSaved = [];

    saveToLocalStorage(localSaved);
}
// ------------------------------------------------------------------

function getCoordingates(city, callback) {

    const requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},us&limit=5&appid=0a2ac5dbbeb08b5bafd134ce15a7e8c5`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            // console.log('Get coordingates .....................................');
            // console.log(data);
        
            lat = data[0].lat;
            lon = data[0].lon;

            let cityAndStateName = `${data[0].name}, ${data[0].state}`
            saveToLocalStorage(cityAndStateName);
         
            $('#current-city').text(`${cityAndStateName}`);

            getCurrentWeather(lat, lon);
            getForecast(lat, lon, callback)

            saveToLocalStorage(cityAndStateName)
            updateSavedCities(cityAndStateName);
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
         
            let imgSrc = $.parseHTML(`
            <div class = "card shadow">
            <img src = "https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt = "" data-toggle = "tooltip" title = "${data.weather[0].main}"/>
            </div>
            `)

            $('#current-date').text(dayjs().format('ddd, MMM D, YYYY'))
            $('#current-temp').text(`Current temp: ${parseInt(data.main.temp)}° F`);
            $('#hi-current-temp').text(`Hi: ${parseInt(data.main.temp_max)}° F`);
            $('#lo-current-temp').text(`Lo: ${parseInt(data.main.temp_min)}° F`)
            $('#current-icon').empty();
            $('#current-icon').append(imgSrc);
            $('#current-wind-speed').text(`Wind: ${data.wind.speed} mph`);
            $('#current-humidity').text(`Humidity: ${data.main.humidity} %`);
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

        //    console.log(currentTime);

            for (let i = 7; i < data.list.length; i += 8) {
                console.log(data.list[i].dt_txt);
                        renderCard($('#forecast-cards-container'), data.list[i]);
                    }
            
            if (typeof callback == 'function') {
                callback();
            }
        });
};

// ---------------------------------------------------------------------------------

function renderCard(cardsContainer, forecastData) {

    let forecastCard = $.parseHTML(`
        <div class="card col-12 col-xl-2 shadow d-flex my-4 ">
        
        <div class="card-body">
            <h3 class="card-title">Title</h4>
            <img class="card-img-top w-50  border-bottom border-2 mb-2 data-toggle="tooltip" title="${forecastData.weather[0].main}" src = "" alt = "forecast conditions" />
            <p  class=" card-text">
            Temp: </br>
    
            <span id="forecast-hi-temp"></span></br>
            <span id="forecast-lo-temp"></span>
            </p>
            <p class="card-text">
            Wind Speed: </br>
            <span id="forecast-wind"></span>
            </p>
            <p class="card-text">
            Humidity: </br>
            <span id="forecast-humidity"></span>
            </p>
        </div>
        </div>`);

    // console.log("Get forecast temp ............................");
    // console.log(forecastData.dt);

    let forecastDate = dayjs.unix(forecastData.dt).format('ddd, MMM D, YYYY');
    let forecastTemp = parseInt(forecastData.main.temp);
    let forecastHiTemp = parseInt(forecastData.main.temp_max);
    let forecastLoTemp = parseInt(forecastData.main.temp_min);
    let forecastWind = parseInt(forecastData.wind.speed);
    let forecastHumidity = forecastData.main.humidity;
    // console.log(forecastTemp);
    
    let imgSrc = `https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;

    $(forecastCard).find(".card-img-top").attr("src", imgSrc);
    $(forecastCard).find(".card-title").text(forecastDate);
    $(forecastCard).find('#forecast-temp').text(`${forecastTemp}° F`);
    $(forecastCard).find('#forecast-hi-temp').text(`Hi: ${forecastHiTemp}° F`);
    $(forecastCard).find('#forecast-lo-temp').text(`Lo: ${forecastLoTemp}° F`);
    $(forecastCard).find('#forecast-wind').text(`${forecastWind} mph`);
    $(forecastCard).find('#forecast-humidity').text(`${forecastHumidity}%`);
    
    $(cardsContainer).append(forecastCard);
}

// ---------------------------------------------------------------------------------

function updateSavedCities(cityName) {
   
        let savedCities = JSON.parse(localStorage.getItem("savedCities"));

        if (!Array.isArray(savedCities)) {
            savedCities = [];
        }

        if (!savedCities.includes(cityName)) {
            savedCities.push(cityName);
          }

          savedCities.sort();
        //   console.log("Sort Saved Cities ..........................");
        //   console.log(savedCities);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
       
        addSearchHistFunc(savedCities);   
}

// ---------------------------------------------------------------------------------

function addSearchHistFunc(savedCitiesObj) {

    $('#saved-cities').empty();
  
    $('#saved-cities').append($.parseHTML(`<option value = "Search-History">Search History</option>`));

    for (i = 0; i < savedCitiesObj.length; i++) {

        let addSearchHist = $.parseHTML(`
            <option value = "${savedCitiesObj[i]}">${savedCitiesObj[i]}</option>
        `)
       
        $('#saved-cities').append(addSearchHist);
    }
}

// ---------------------------------------------------------------------------------

function loadSavedCities() {
    
    let savedCities = JSON.parse(localStorage.getItem("savedCities"));
   
    if (!Array.isArray(savedCities)) {
        savedCities = [];
    }

    addSearchHistFunc(savedCities);
}

// ---------------------------------------------------------------------------------

function apiCalls(city) {
  
    getCoordingates(city, function () {
        $('#results-container').fadeIn("slow");
        // $('#current-weather').fadeIn("fast");
    });
    
}

// ---------------------------------------------------------------------------------

citySelectFormEl.on('submit', function (event) {

    event.preventDefault();
    
    let selectedOption = $('.city-input').val();

    if (selectedOption !== "") {
        localStorage.setItem('Saved-To-Storage', JSON.stringify(selectedOption));
      
        apiCalls(selectedOption);
        $('#city-input').val("");
    }
    location.reload();
});

// -----------------------------------------------

savedCityInputEl.on('input', function(event) {

    let selectedOption = $('#saved-cities').val();

    console.log("dropdown selected option ...........................");
    console.log(selectedOption);
    console.log(event);
        localStorage.setItem('Saved-To-Storage', JSON.stringify(selectedOption));
        // console.log(" ...........................");
        apiCalls(selectedOption);
        $('#city-input').val("");  
        location.reload();  
})

// -----------------------------------------------
clearSavedListBtnEl.on("click", function () {
    
    let localSaved = function () {
        JSON.parse(localStorage.getItem("savedCities"));
        if (!Array.isArray(loadedCity)) {
            loadedCity = [];
        }
    };

    let localPrinted = function () {
        JSON.parse(localStorage.getItem("Saved-To-Storage"));
        if (!Array.isArray(loadedCity)) {
            loadedCity = [];
        }
    };

    localPrinted = [];
    localSaved = [];

    console.log(localPrinted);
    console.log(localSaved);

    localStorage.setItem('savedCities', JSON.stringify(localSaved));
    localStorage.setItem('Saved-To-Storage', JSON.stringify(localPrinted));

     console.log(localPrinted);
    console.log(localSaved);
    
    location.reload();
})

// -----------------------------------------------

$(document).ready(function () {
    let savedCity = JSON.parse(localStorage.getItem('Saved-To-Storage'));
    let printedCity = JSON.parse(localStorage.getItem('Saved-To-Storage'));
    apiCalls(savedCity, printedCity);
    $('[data-toggle="tooltip"]').tooltip();

    loadSavedCities();
});

// --------------------------------------------------------------