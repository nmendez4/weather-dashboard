var locationList = $("#location-list");
var locations = [];
var key = "0e02e78d890d781f0a2962b3578bb511";

function formatDay(date) {
    var date = new Date;
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();

    var dayOutput = date.getFullYear() + 
    '/' +
    (month<10 ? '0' : '') + month + '/' +
    (day<10 ? '0' : '') + day;
    return dayOutput;
}

init();

function init() {
    //get stored cities from localStorage
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    // if stored, retrieve from localStorage, if not then update 
    if (storedCities == null) {
        cities = storedCities;
    }
    renderCities;
    console.log(cities);
}

function storedCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
   // console.log(localStorage);
}

function renderCities() {
    // clear search bar, to allow for new input
    locationList.empty();

    // creates new li element for every city searched
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var li = $("<li>").text(city);
        li.attr("id", "listCities");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");
        cityList.prepend(li);
    }

    if (!city) {
        return
    } else {
        getResponseWeather(city)
    };
}

$("#add-city").on("click", function(event) {
    event.preventDefault();

    var city = $("#city-input").val().trim();
    if (city === "") {
        return;
    }
    cities.push(city);

    storedCities();
    renderCities();
});

function getResponseWeather(cityName) {
    // search for specified city using openweather and API and key
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid" + key;

    // clear current weather listed
    $("#today-weather").empty();
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response) {

        cityTitle = $("<h3>").text(response.name + " " + formatDay());
        $("#today-weather").append(cityTitle);
        var temperatureChange = parseInt((response.main.temp) * 9/5 - 459);
        var cityTemp = $("<p>").text("Temperature: " + temperatureChange + " °F");
        $("today-weather").append(cityTemp);
        var humidity = $("<p>").text("Humidity: " + response.main.humidity + " %");
        $("today-weather").append(humidity);
        var windSpeed = $("<p>").text("Wind Speed " + response.wind.speed + " MPH");
        $("#today-weather").append(windSpeed);
        var coordLong = response.coord.lon;
        var coordLat = response.coord.lat;

        var apiURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + coordLat + "&lon=" + coordLong;
        $.ajax({
            url: apiURL2,
            method: "GET"
        }).then(function(responseuv) {
            var locationUV = $("<span>").text(responseuv.value);
            var uvIndex = $("<p>").text("UV Index: ");
            uvIndex.append(locationUV);
            $("#today-weather").append(uvIndex);

            if (responseuv.value > 0 && responseuv.value <=2) {
                locationUV.attr("class", "green")
            } else if (responseuv.value > 2 && responseuv.value <= 5) {
                locationUV.attr("class", "yellow")
            } else if (responseuv.value > 5 && responseuv.value <= 7) {
                locationUV.attr("class", "orange")
            } else if (responseuv.value > 7 && responseuv.value <= 9) {
                locationUV.attr("class", "red")
            } else {
                locationUV.attr("class", "purple")
            }
        });

        var apiURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
        $.ajax({
            url: apiURL3,
            method: "GET"
        }).then(function(response5day) {
            $("#boxes").empty();
            
        })
    }) 
}