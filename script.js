$(document).ready(function () {

    var apiKey = "8bf7617a246c576097f0d958220f6d4c";
    var cityArr = [];

    getSearchHistory();


    $("#search-button").on("click", function (event) {

        event.preventDefault();

        var searchedCity = $("#city-input").val();

        if (!searchedCity) {
            return null;
        }


        getCurrentConditions(searchedCity)
         .then(function(currentConditions) {

            appendCurrentConditions(currentConditions);
        })
        .then(function() {

            saveCityToSearchHistory(searchedCity);
            getSearchHistory();
        })

    });

    function getCurrentConditions(city) {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(queryURL);
            console.log(response);

            $(".city-name").html("<h3>" + response.name + " " + "(" + moment().format("L") + ")" + " " + response.weather[0].icon + "</h3>");
            var tempF = (response.main.temp - 273.15) * 1.8 + 32;
            $(".temp").text("Temperature: " + tempF.toFixed(1) + "°F");
            $(".humidity").text("Humidity: " + response.main.humidity + "%");
            $(".wind-speed").text("Windspeed: " + response.wind.speed + " MPH");
            var lon = response.coord.lon;
            var lat = response.coord.lat;

            uvIndex(lat, lon);
        });
    }

    function uvIndex(lat, lon) {
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var uv = response.value;
            $(".uv-index").html("UV Index: " + '<span class="uv-index-number">' + uv + '</span');



            

        });
    }


    function saveCityToSearchHistory(city) {

        cityArr.push(city.toLowerCase());

        localStorage.setItem("city", JSON.stringify(cityArr));
    }

    function getSearchHistory() {
        var searchHistory = JSON.parse(localStorage.getItem("city"));

        if (!searchHistory) {
            return null;
        }

        cityArr = searchHistory;

        $("#cities-list").empty();

        for (var i = 0; i < searchHistory.length; i++) {
            var cityButton = $("<button>");
            cityButton.addClass("w-100 text-left city-btn");
            cityButton.attr("data-name", searchHistory[i]);
            cityButton.text(searchHistory[i]);

            $("#cities-list").append(cityButton);
        }
    }


});