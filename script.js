var cityArray = [];
var APIKey = "&appid=b39f7b6e38230aa7f049f7d88383ccc9";

$(document).ready(function () {
    $("#searchBtn").click(function (event) {
        event.preventDefault();

        var searchName = $("#search").val().trim();
        promptSearch(searchName);
        //console.log(searchName);
    })
    function promptSearch(citySearch) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + APIKey;
        $("<button>").text(citySearch).prepend(".list-group-item");
        $.ajax({
            url: queryURL,
            Method: "GET"
        }).then(function (response) {
            var cityPrevious = JSON.parse(localStorage.getItem("cities"));
            if (cityPrevious) {
                cityPrevious.push(response.name);
                localStorage.setItem("cities", JSON.stringify(cityPrevious));
            } else {
                cityArray.push(response.name)
                localStorage.setItem("cities", JSON.stringify(cityArray));
                console.log(cityArray);
            }
            var cityName = $(".jumbotron").addClass("cityWeather").text(citySearch + " | ");
            var currentDate = moment().format("  MM-DD-YYYY");

            var iconcode = response.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            var weatherIcon = $("<img>").attr("src", iconurl);

            var fTemp = (response.main.temp - 273.15) * 1.80 + 32;
            var roundedTemp = Math.floor(fTemp);
            var dataTemp = $("<p>").text("Temperature: " + roundedTemp + "°F").addClass("info");

            var dataHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("info");

            var dataWind = $("<p>").text("Wind Speed: " + response.wind.speed).addClass("info");

            cityName.append(currentDate, weatherIcon, dataTemp, dataHumidity, dataWind)

            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
            $.ajax({
                url: uvURL,
                Method: "GET"
            }).then(function (response) {
                var dataUV = $("<div>").addClass('info uv-index').text("UV Index: ");
                var uvValue = $("<span class='badge id='current-uv-level'>").text(response.value);
                dataUV.append(uvValue);
                if (response.value >= 0 && response.value < 3) {
                    $(uvValue).addClass("safe");
                } else if (response.value >= 3 && response.value < 6) {
                    $(uvValue).addClass("moderate");
                } else if (response.value >= 6 && response.value < 8) {
                    $(uvValue).addClass("warning");
                } else if (response.value >= 8 && response.value < 11) {
                    $(uvValue).addClass("very-high");
                } else if (response.value >= 11) {
                    $(uvValue).addClass("dangerous");
                }
                cityName.append(dataUV);
                renderSearchList();
            })
            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + APIKey;

            for (var i = 1; i < 6; i++) {
                $.ajax({
                    url: queryURL,
                    Method: "GET"
                }).then(function (response) {
                    var card = $("<div>").addClass("card-body");

                    var cardInfo = $("<div>").addClass(".cardbody");
                    var cardDate = $("<h5>").text(moment.unix(response.daily[i].dt).format("MM/DD/YYYY"));
                    cardInfo.addClass("headline");

                    var cardTemp = $("<p>").text("Temp: " + response.daily[i].temp.max + "°");
                    cardTemp.attr("id", "#fiveDayTemp[i]");

                    var cardHumidity = $("<p>").attr("id", "humDay").text("Humidity: " + JSON.stringify(response.daily[i].humidity) + "%");
                    cardHumidity.attr("id", "#fiveHumidity[i]");

                    var iconCode = response.daily[i].weather[0].icon;
                    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    var weatherImg = $("<img>").attr("src", iconURL);
                    $("#testImage").attr("src", iconURL);

                    card.append(cardDate);
                    card.append(weatherImg);
                    card.append(cardTemp);
                    card.append(cardHumidity);
                    cardInfo.append(card);
                    $("#cardDay").append(cardInfo);
                    $("#fiveDayTemp[i]").empty();
                    $(".jumbotron").append(card);
                })
            }
            $("#search").val("");

        })

    }
    
   
})