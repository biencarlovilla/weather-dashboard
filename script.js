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
                let dataUV = $("<div>").addClass('info uv-index').text("UV Index: ");
                let uvValue = $("<span class='badge id='current-uv-level'>").text(response.value);
                dataUV.append(uvValue);
                cityName.append(dataUV);
            })
            
        })

    }
    
   
})