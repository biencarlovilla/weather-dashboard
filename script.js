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
    })
    }
    
})