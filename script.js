// ...Existing code...
var searchbtn=document.querySelector("#city-search")
var inputcity=document.querySelector("#city")
var maincontainer= document.querySelector("#container")
var key= "f939a99003b80f500688b21bb8e8a835"
// Function to handle form submission
var searchhistory=JSON.parse(localStorage.getItem("searchhistorylist")) || []
function handleFormSubmission(event) {
    event.preventDefault();
    var city = inputcity.value.trim();
    if (city !== "") {
        showWeatherData(city);
        searchhistory.push(city);
        localStorage.setItem("searchhistorylist", JSON.stringify(searchhistory));
        // renderSearchHistory();
        inputcity.value = "";
    } 
}
searchbtn.addEventListener("click", handleFormSubmission)
// Function to show weather data
function showWeatherData(city) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid="+key)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            fetch("https://api.openweatherapp.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
                "&exclude=minutely,hourly&units=imperial&appid=" + key)
                .then(function (response) {
                    return response.json();
                })
                .then(function (weatherData) {
                    console.log(weatherData);
                    var weatherIcon = weatherData.current.weather[0].icon;
                    var temperature = weatherData.current.temp;
                    var humidity = weatherData.current.humidity;
                    var windSpeed = weatherData.current.wind_speed;
                    var uvIndex = weatherData.current.uvi;
                    var currentDate = moment.unix(weatherData.current.dt).format("MM/DD/YYYY");

                    // Update the DOM with weather data
                    dateel.textContent = city + " " + currentDate;
                    tempel.textContent = "Temperature: " + temperature + "°F";
                    humidel.textContent = "Humidity: " + humidity + "%";
                    windel.textContent = "Wind Speed: " + windSpeed + " MPH";
                    uviel.textContent = "UV Index: " + uvIndex;

                    // Update UV Index background color based on value
                    if (uvIndex < 3) {
                        uviel.style.backgroundColor = "green";
                        uviel.style.color = "white";
                    } else if (uvIndex < 7) {
                        uviel.style.backgroundColor = "yellow";
                        uviel.style.color = "black";
                    } else {
                        uviel.style.backgroundColor = "red";
                        uviel.style.color = "white";
                    }

                    // Update future forecast
                    futureel.innerHTML = ""; // Clear existing forecast
                    for (var i = 1; i < 6; i++) {
                        var forecastDate = moment.unix(weatherData.daily[i].dt).format("MM/DD/YYYY");
                        var forecastIcon = weatherData.daily[i].weather[0].icon;
                        var forecastTemp = weatherData.daily[i].temp.day;
                        var forecastHumidity = weatherData.daily[i].humidity;

                        var forecastCard = document.createElement("div");
                        forecastCard.classList.add("forecast-card");

                        var forecastDateEl = document.createElement("h4");
                        forecastDateEl.textContent = forecastDate;

                        var forecastIconEl = document.createElement("img");
                        forecastIconEl.src = "https://openweathermap.org/img/wn/" + forecastIcon + ".png";
                        forecastIconEl.alt = "Weather Icon";

                        var forecastTempEl = document.createElement("p");
                        forecastTempEl.textContent = "Temp: " + forecastTemp + "°F";

                        var forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.textContent = "Humidity: " + forecastHumidity + "%";

                        forecastCard.appendChild(forecastDateEl)
                        forecastCard.appendChild(forecastIconEl)
                        forecastCard.appendChild(forecastTempEl)
                        forecastCard.appendChild(forecastHumidityEl)
                        maincontainer.appendChild(forecastCard)
                    }
                })
            })
        }
                
