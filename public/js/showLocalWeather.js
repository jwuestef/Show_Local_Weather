    var API_KEY = "64970f2fa5cf3c3aef3a497bd77dc444";
    var celScale = false;
    var callType = 0  // 0 for local, 1 for remote location

$(document).ready(function() { // when the document is finished loading


    $.getJSON("https://ipinfo.io", function(d){  //make an AJAX (or getJSON - a simplified AJAX) to get the user's location
        var loc = d.loc.split(",");  // we get ip-info, and parse it for location data, and split it into an array
        var locLat = loc[0];    // the first array value is the latitude
        var locLon = loc[1];    // the 2nd array value is the longitude
        var link = "http://api.openweathermap.org/data/2.5/forecast/daily?units=imperial&lat=" + locLat + "&lon=" + locLon + "&cnt=8&appid=" + API_KEY;  // build the link for the API call

        $.getJSON(link, function(wd){  // make an API call, pass the returned weather data (wd) to this function
            renderWD(wd, celScale);  // pass the weather data and the cel (whether we're in cel or far) to the render function, to parse and finally render data
            $("#toggle").off();
            $("#toggle").on("click", function() {
                celScale = !celScale;
                renderWD(wd, celScale);
            });
        });
    });  // end of $.getJSON("https://ipinfo.io"


    // validate zipcode field input. If it's not 5 digits or isn't a number, show the error-span, otherwise hide the error-span
    $("#zipcode").keyup(function() {
        var zipcode = Number( $("#zipcode").val() );
        if(zipcode.toString().length != 5 || !regIsNumber(zipcode)) {
            $("#zipError").show("slideup");
        } else {
            $("#zipError").hide("slideup");
        }
    });


    // when the button is pressed, build the link and make an AJAX call, and if successful then render the data
    $("#zipcodeSubmit").on("click", function() {
        var zipcode = $("#zipcode").val();
        var link = "http://api.openweathermap.org/data/2.5/forecast/daily?units=imperial&zip=" + zipcode + "&appid=" + API_KEY;
        $.ajax({
            type: "GET",
            url: link
        }).done(function(data) {   // if ajax call finishes successfully
            renderWD(data, celScale);
            $("#toggle").off();
            $("#toggle").on("click", function() {
                celScale = !celScale;
                renderWD(data, celScale);
            });
        }).fail(function(){   // if the ajax call fails to finish for some reason.
            alert("The ajax call messed up.")
        });
    });    // end of $("#zipcode")


})    // end of $(document).ready(function



var regIsNumber = function (fData) {
    var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$");
    return reg.test(fData);
 }



function renderWD(weatherData, celScale){
    var day0 = weatherData.list[0];
    var day1 = weatherData.list[1];
    var day2 = weatherData.list[2];
    var day3 = weatherData.list[3];
    var day4 = weatherData.list[4];
    var day5 = weatherData.list[5];

    var cityName = weatherData.city.name;
    $("#cityName").text(cityName);

    // $("#day0Date").text(timeConverter(day0.dt));
    $("#day1Date").text(timeConverter(day1.dt));
    $("#day2Date").text(timeConverter(day2.dt));
    $("#day3Date").text(timeConverter(day3.dt));
    $("#day4Date").text(timeConverter(day4.dt));
    $("#day5Date").text(timeConverter(day5.dt));

    var day0IconCode = day0.weather[0].icon;
    var day1IconCode = day1.weather[0].icon;
    var day2IconCode = day2.weather[0].icon;
    var day3IconCode = day3.weather[0].icon;
    var day4IconCode = day4.weather[0].icon;
    var day5IconCode = day5.weather[0].icon;
    var day0Icon = "<img id='day0Icon' src='http://openweathermap.org/img/w/" + day0IconCode + ".png'>";
    var day1Icon = "<img id='day1Icon' src='http://openweathermap.org/img/w/" + day1IconCode + ".png'>";
    var day2Icon = "<img id='day2Icon' src='http://openweathermap.org/img/w/" + day2IconCode + ".png'>";
    var day3Icon = "<img id='day3Icon' src='http://openweathermap.org/img/w/" + day3IconCode + ".png'>";
    var day4Icon = "<img id='day4Icon' src='http://openweathermap.org/img/w/" + day4IconCode + ".png'>";
    var day5Icon = "<img id='day5Icon' src='http://openweathermap.org/img/w/" + day5IconCode + ".png'>";
    $("#day0Icon").remove();
    $("#day1Icon").remove();
    $("#day2Icon").remove();
    $("#day3Icon").remove();
    $("#day4Icon").remove();
    $("#day5Icon").remove();
    $("#day0Desc").before(day0Icon);
    $("#day1Desc").before(day1Icon);
    $("#day2Desc").before(day2Icon);
    $("#day3Desc").before(day3Icon);
    $("#day4Desc").before(day4Icon);
    $("#day5Desc").before(day5Icon);

    $("#day0Desc").html(day0.weather[0].description);
    $("#day1Desc").html(day1.weather[0].description);
    $("#day2Desc").html(day2.weather[0].description);
    $("#day3Desc").html(day3.weather[0].description);
    $("#day4Desc").html(day4.weather[0].description);
    $("#day5Desc").html(day5.weather[0].description);

    $("#day0High").text(returnTemp(day0.temp.max, celScale));
    $("#day1High").text(returnTemp(day1.temp.max, celScale));
    $("#day2High").text(returnTemp(day2.temp.max, celScale));
    $("#day3High").text(returnTemp(day3.temp.max, celScale));
    $("#day4High").text(returnTemp(day4.temp.max, celScale));
    $("#day5High").text(returnTemp(day5.temp.max, celScale));

    $("#day0Low").text(returnTemp(day0.temp.min, celScale));
    $("#day1Low").text(returnTemp(day1.temp.min, celScale));
    $("#day2Low").text(returnTemp(day2.temp.min, celScale));
    $("#day3Low").text(returnTemp(day3.temp.min, celScale));
    $("#day4Low").text(returnTemp(day4.temp.min, celScale));
    $("#day5Low").text(returnTemp(day5.temp.min, celScale));

    // display different background image based on the weather
    var firstDigit = Math.floor(day0.weather[0].id/100); //figure out with "class" (divided by 100's) the current weather fits into
    switch (firstDigit) {
        case 2:  //thunderstorm
            $('body').css('background-image', 'url(css/thunderstorm.jpg)');
            break;
        case 3:  //drizzle
            $('body').css('background-image', 'url(css/drizzle.jpg)');
            break;
        case 5:  //rain
            $('body').css('background-image', 'url(css/rain.jpeg)');
            break;
        case 6:  //snow
            $('body').css('background-image', 'url(css/snow.jpg)');
            break;
        case 7:  //atmosphere
            $('body').css('background-image', 'url(css/haze.jpg)');
            break;
        case 8:  //clear or clouds
            $('body').css('background-image', 'url(css/clearOrClouds.jpg)');
            break;
        case 9:  //extreme or additional
            $('body').css('background-image', 'url(css/extremeOrAdditional.jpg)');
            break;
        default: 
            $('body').css('background-image', 'url(css/clearOrClouds.jpg)');
            console.log("default sunshine background chosen")
            break;

    }

}



// function to pick Fahrenheit vs Celcius, based on the "cel" variable, calculate if needed, and return it in a string
function returnTemp(fTemp, c) {
    if(c) return Math.round((fTemp-32) * (5/9)) + " C";
    return Math.round(fTemp) + " F";
}


// convert a UNIX time code to human-friendly format
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    var time = month + ' ' + date;   // + ' ' + year + ' ' + hour + ':' + min + ':' + sec 
    return time;
}