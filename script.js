var APIKey = "&appid=b39f7b6e38230aa7f049f7d88383ccc9";

$(document).ready(function () {
    $("#searchBtn").click(function (event) {
        event.preventDefault();

        var searchName = $("#search").val().trim();
        console.log(searchName);
    })

})