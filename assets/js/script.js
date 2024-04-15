let searchInput = document.querySelector("#citySearch");
let searchButton = document.querySelector("#searchB");
let cDate = document.querySelector("#date");
let date2 = document.querySelector("#date2");
let date3 = document.querySelector("#date3");
let date4 = document.querySelector("#date4");
let date5 = document.querySelector("#date5");
let date6 = document.querySelector("#date6");
let mainTemp = document.querySelector("#mainTemp");
let mainWind = document.querySelector("#mainWind");
let mainHum = document.querySelector("#mainHum");
let weatherSymbol = document.querySelector("#weatherSymbol");
let cardIcon = document.querySelectorAll(".cardWeather");
let cardBio = document.querySelectorAll(".font");
console.log(cardIcon);
console.log(cardBio);

const cityList = JSON.parse(localStorage.getItem("cities")) || [];

// Above, I set up my event listener and selected the input and button in my html.
// Also, I selected all the date areas in my html for my displaydate function.
// Also, I selected all the areas which will display content for the weather.(lines 9-14)
// Also, I recieved the items from local storage for a function later.

function displaydate() {
  const now = dayjs().format("MM/DD/YYYY");
  const day2 = dayjs().add(1, "day").format("MM/DD/YYYY");
  const day3 = dayjs().add(2, "day").format("MM/DD/YYYY");
  const day4 = dayjs().add(3, "day").format("MM/DD/YYYY");
  const day5 = dayjs().add(4, "day").format("MM/DD/YYYY");
  const day6 = dayjs().add(5, "day").format("MM/DD/YYYY");

  console.log(now);
  console.log(day2);
  console.log(day3);
  console.log(day4);
  console.log(day5);
  console.log(day6);

  cDate.textContent = now;
  date2.textContent = day2;
  date3.textContent = day3;
  date4.textContent = day4;
  date5.textContent = day5;
  date6.textContent = day6;
}

// Above, I created a display date function withe the elements selected and using dayjs.
// I formatted the dates and assigned them in their correrct area.

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
                rendered: "false",
              };
              // Above, I do a for loop for the data so it can match the exact output im looking for.
              cities.push(city);

              let citiesSerialized = JSON.stringify(cities);

              localStorage.setItem("cities", citiesSerialized);

              let cityName = document.querySelector("#cityName");
              cityName.textContent = city.name;

              console.log(city);
              getWeatherInfo(lat, lon);
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
  const cityURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=1f84100edd7f6cddf642b63a288eb2cd`;
  // Above, I get the url to find precise location using lon and lat

  let cities = cityList;
  let cityName = document.querySelector("#cityName");

  fetch(cityURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayWeatherData(data);
        });
      }
    })
    // Above, I fetch the data turn it into json, log it for confirmation and pass it to the displayWeatherData function.
    .catch(function (error) {
      alert("Unable to connect to server!");
    });
  // Above, is for if the api fails.

  /*for (i = 0; i <= cities.length; i++) {

    console.log(cities[i]);
    if (cities.length === 0) {
      break;
    } else if (cities[i]?.lati === lat && cities[i]?.long === lon) {
      cityName.textContent = cities[i].name;
      break
    } else { 
    }
  }*/

  cities.forEach((city) => {
    if (city.lati === lat && city.long === lon) {
      cityName.textContent = city.name;
    }
  });
}
// the commented out code above is for my refrence, it is for a bug I encountered due to looping incorrectly so values were not passed correctly.
// solve1 = remove "=" sign in condition
// solve2 = add conditional chaining with ?.
// solve3 = for each loop

function displayWeatherData(data) {
  console.log(data.daily);
  // Above, is where i consol =e log to make sure each property exists.
  mainTemp.textContent = `Temp: ${data.current.temp}°F`;
  mainWind.textContent = ` Wind: ${data.current.wind_speed} MPH`;
  mainHum.textContent = `Humidity: ${data.current.humidity} %`;
  // Above, is the text content for each part of the main area which is the current weather condition.
  if (data.current.weather[0].description === "clear sky") {
    weatherSymbol.textContent = "🌤";
  } else if (data.current.weather[0].description === "few clouds") {
    weatherSymbol.textContent = "🌥";
  } else if (data.current.weather[0].description.includes("rain")) {
    weatherSymbol.textContent = "🌧";
  } else if (data.current.weather[0].description === "light rain") {
    weatherSymbol.textContent = "🌧";
  } else if (data.current.weather[0].description === "thunderstorm") {
    weatherSymbol.textContent = "🌩";
  } else if (data.current.weather[0].description.includes("snow")) {
    weatherSymbol.textContent = "🌨";
  } else {
    weatherSymbol.textContent = "⛅";
  }
  //  Above is a if statment for the main area figure text content and its respective weather icon.
  cardIcon.forEach((card) => {
    const cardID = card.id;
    console.log(cardID);

    if (cardID === "cardIcon1") {
      if (data.daily[0].weather[0].description === "clear sky") {
        card.textContent = "🌤";
      } else if (data.daily[0].weather[0].description === "few clouds") {
        card.textContent = "🌥";
      } else if (data.daily[0].weather[0].description.includes("rain")) {
        card.textContent = "🌧";
      } else if (data.daily[0].weather[0].description === "light rain") {
        card.textContent = "🌧";
      } else if (data.daily[0].weather[0].description === "thunderstorm") {
        card.textContent = "🌩";
      } else if (data.daily[0].weather[0].description.includes("snow")) {
        card.textContent = "🌨";
      } else {
        card.textContent = "⛅";
      }
    } else if (cardID === "cardIcon2") {
      if (data.daily[1].weather[0].description === "clear sky") {
        card.textContent = "🌤";
      } else if (data.daily[1].weather[0].description === "few clouds") {
        card.textContent = "🌥";
      } else if (data.daily[1].weather[0].description === "rain") {
        card.textContent = "🌧";
      } else if (data.daily[1].weather[0].description.includes("rain")) {
        card.textContent = "🌧";
      } else if (data.daily[1].weather[0].description === "thunderstorm") {
        card.textContent = "🌩";
      } else if (data.daily[1].weather[0].description.includes("snow")) {
        card.textContent = "🌨";
      } else {
        card.textContent = "⛅";
      }
    } else if (cardID === "cardIcon3") {
      if (data.daily[2].weather[0].description === "clear sky") {
        card.textContent = "🌤";
      } else if (data.daily[2].weather[0].description === "few clouds") {
        card.textContent = "🌥";
      } else if (data.daily[2].weather[0].description.includes("rain")) {
        card.textContent = "🌧";
      } else if (data.daily[2].weather[0].description === "light rain") {
        card.textContent = "🌧";
      } else if (data.daily[2].weather[0].description === "thunderstorm") {
        card.textContent = "🌩";
      } else if (data.daily[2].weather[0].description.includes("snow")) {
        card.textContent = "🌨";
      } else {
        card.textContent = "⛅";
      }
    } else if (cardID === "cardIcon4") {
      if (data.daily[3].weather[0].description === "clear sky") {
        card.textContent = "🌤";
      } else if (data.daily[3].weather[0].description === "few clouds") {
        card.textContent = "🌥";
      } else if (data.daily[3].weather[0].description.includes("rain")) {
        card.textContent = "🌧";
      } else if (data.daily[3].weather[0].description === "light rain") {
        card.textContent = "🌧";
      } else if (data.daily[3].weather[0].description === "thunderstorm") {
        card.textContent = "🌩";
      } else if (data.daily[3].weather[0].description.includes("snow")) {
        card.textContent = "🌨";
      } else {
        card.textContent = "⛅";
      }
    } else if (cardID === "cardIcon5") {
      if (data.daily[4].weather[0].description === "clear sky") {
        card.textContent = "🌤";
      } else if (data.daily[4].weather[0].description === "few clouds") {
        card.textContent = "🌥";
      } else if (data.daily[4].weather[0].description.includes("rain")) {
        card.textContent = "🌧";
      } else if (data.daily[4].weather[0].description === "light rain") {
        card.textContent = "🌧";
      } else if (data.daily[4].weather[0].description === "thunderstorm") {
        card.textContent = "🌩";
      } else if (data.daily[4].weather[0].description.includes("snow")) {
        card.textContent = "🌨";
      } else {
        card.textContent = "⛅";
      }
    } else {
    }
  });

  // Above is a for each loop for each card figure element and a if statment for each card figure area text contnet.

  cardBio.forEach((eachCard) => {
    const bioID = eachCard.id;
    console.log(bioID);

    if (bioID === "cardTemp1") {
      eachCard.textContent = `Temp: ${data.daily[0].temp.day}°F`;
    } else {
    }

    if (bioID === "cardTemp2") {
      eachCard.textContent = `Temp: ${data.daily[1].temp.day}°F`;
    } else {
    }

    if (bioID === "cardTemp3") {
      eachCard.textContent = `Temp: ${data.daily[2].temp.day}°F`;
    } else {
    }

    if (bioID === "cardTemp4") {
      eachCard.textContent = `Temp: ${data.daily[3].temp.day}°F`;
    } else {
    }

    if (bioID === "cardTemp5") {
      eachCard.textContent = `Temp: ${data.daily[4].temp.day}°F`;
    } else {
    }

    // Above is a for loop for the cards bio area and  if statments to set the content of each card temp area text content .

    if (bioID === "cardWind1") {
      eachCard.textContent = `Wind: ${data.daily[0].wind_speed} MPH`;
    } else {
    }

    if (bioID === "cardWind2") {
      eachCard.textContent = `Wind: ${data.daily[1].wind_speed} MPH`;
    } else {
    }

    if (bioID === "cardWind3") {
      eachCard.textContent = `Wind: ${data.daily[2].wind_speed} MPH`;
    } else {
    }

    if (bioID === "cardWind4") {
      eachCard.textContent = `Wind: ${data.daily[3].wind_speed} MPH`;
    } else {
    }

    if (bioID === "cardWind5") {
      eachCard.textContent = `Wind: ${data.daily[4].wind_speed} MPH`;
    } else {
    }

    // Above are  if statments to set the content of each card wind area text content.

    if (bioID === "cardHum1") {
      eachCard.textContent = `Humidity: ${data.daily[0].humidity} %`;
    } else {
    }

    if (bioID === "cardHum2") {
      eachCard.textContent = `Humidity: ${data.daily[1].humidity} %`;
    } else {
    }

    if (bioID === "cardHum3") {
      eachCard.textContent = `Humidity: ${data.daily[2].humidity} %`;
    } else {
    }

    if (bioID === "cardHum4") {
      eachCard.textContent = `Humidity: ${data.daily[3].humidity} %`;
    } else {
    }

    if (bioID === "cardHum5") {
      eachCard.textContent = `Humidity: ${data.daily[4].humidity} %`;
    } else {
    }

    // Above are  if statments to set the content of each card Humidity text content.
  });

  console.log("hello");
}

function renderlastSearch() {
  let cities = cityList;

  console.log(cities);

  if (cities.length > 0) {
    const lastItem = cities[cities.length - 1];
    console.log(lastItem.long);
    getWeatherInfo(lastItem.lati, lastItem.long);
  } else {
    console.log("No cities in the list");
  }
}

$(document).ready(function () {
  // Handler for .ready() called.
  renderlastSearch();
  // I called render last search first.
  displaydate();
  searchButton.addEventListener("click", getValue);
});
