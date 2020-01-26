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
            .then(function (currentConditions) {

                clear();
                appendCurrentConditions(currentConditions);
            })
            .then(function () {

                saveCityToSearchHistory(searchedCity);
                getSearchHistory();
            })
            .then(function () {

                getFiveDayForecast(searchedCity)
                    .then(function (forecast) {

                        appendFiveDayForecast(forecast);
                    });
            })

            .catch(function () {

                return $("error-message").text("Must be a valid city");
            });

    });

    function getCurrentConditions(city) {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(queryURL);
            console.log(response);

            $(".city-name").html("<h3>" + response.name + " " + "(" + moment().format("L") + ")"  + "</h3>");
            var iconImg = $("<img>");
            $(".icon-image").append(iconImg.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"));
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

            if (uv < 4) {
                $(".uv-index-number").css({
                    "background-color": "green",
                    color: "white",
                    padding: "3px"
                });
            } else if (uv >= 5 && uv <= 7) {
                $(".uv-index-number").css({
                    "background-color": "yellow",
                    color: "black",
                    padding: "3px"
                });
            } else {
                $(".uv-index-number").css({
                    "background-color": "red",
                    color: "white",
                    padding: "3px"
                });
            }

        });
    }

    function getFiveDayForecast(city) {

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(queryURL);
            console.log(response);

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