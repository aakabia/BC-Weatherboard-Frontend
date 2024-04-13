let searchInput = document.querySelector("#citySearch");
let searchButton = document.querySelector("#searchB");
const cityList = JSON.parse(localStorage.getItem("cities")) || [];

searchButton.addEventListener("click", getValue);
// Above, I set up my event listener and selected the input and button in my html.
function getValue(event) {
  event.preventDefault();
  let searchInputValue = searchInput.value.trim();

  if (searchInputValue !== "" && searchInputValue.includes(",")) {
    cityAndState = searchInputValue.split(",");
    city = cityAndState[0];
    state = cityAndState[1];

    cityUpper = city[0].toUpperCase() + city.slice(1);
    stateUpper = state[0].toUpperCase() + state.slice(1);
  } else {
    alert("Please pick a City , State !");
  }
  //Above, I get the city and state input seprated by a comma, there must be no space where the comma is.
  if (cityUpper.includes(" ")) {
    citySplit = cityUpper.split(" ");
    cityFirst = citySplit[0];
    citySecond = citySplit[1];
    citySecond = citySecond[0].toUpperCase() + citySecond.slice(1);
    cityUpper = cityFirst + " " + citySecond;
  }

  if (stateUpper.includes(" ")) {
    stateSPlit = stateUpper.split(" ");
    firstUpper = stateSPlit[0];
    secondUpper = stateSPlit[1];
    secondUpper = secondUpper[0].toUpperCase() + secondUpper.slice(1);
    stateUpper = firstUpper + " " + secondUpper;
  }
  // Above, is for if the city and state values have more than one word seperated by a space.
  console.log(cityUpper);
  console.log(stateUpper);

  getLatLonData(cityUpper, stateUpper);

  searchInput.value = "";

  // Above, I log those values to the scrren and call a new function passing new city and state as parameters.
}

function getLatLonData(cityUpper, stateUpper) {
  const apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityUpper}&limit=5&appid=1f84100edd7f6cddf642b63a288eb2cd`;
  let statefound = false;
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  // Above, I get the url  for the lon and lat from api given on page.
  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (data.length === 0) {
            alert("Error City Not Found!");
          } else {
            console.log(data);
          }
          // Above, I fetch the data and return it in json format.
          for (i = 0; i < data.length; i++) {
            if (data[i].state === stateUpper) {
              statefound = true;

              let lat = data[i].lat;
              let lon = data[i].lon;

              let city = {
                name: cityUpper,
                state: stateUpper,
                lati: lat,
                long: lon,
              };
              // Above, I do a for loop for the data so it can match the exact output im looking for.
              cities.push(city);

              let citiesSerialized = JSON.stringify(cities);

              localStorage.setItem("cities", citiesSerialized);

              console.log(city);
              //getWeatherInfo(lat,lon);
            }
            // Above, I log the data and save the object created from the data to local storage.
            if (!statefound) {
              alert("State Not found!");
              break;
            }
          }
        });
      }
    })
    // Above, is my alert if a state is not found
    .catch(function (error) {
      alert("Unable to connect to server!");
    });
  // Above, is my alert if the api is not working.
}

function getWeatherInfo(lat, lon) {
  const cityURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=1f84100edd7f6cddf642b63a288eb2cd`;
  // Above, I get the url to find precise location using lon and lat
  fetch(cityURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          //displayWeatherData(data)
        });
      }
    })
    // Above, I fetch the data turn it into json, log it for confirmation and pass it to the displayWeatherData function.
    .catch(function (error) {
      alert("Unable to connect to server!");
    });
  // Above, is for if the api fails.
}

function displayWeatherData() {
  console.log("hello");
}

displayWeatherData;
