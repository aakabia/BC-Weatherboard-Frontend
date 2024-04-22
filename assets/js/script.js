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
let cityInput = document.querySelector("#cityInput");




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
  event.stopPropagation();
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

  // Above, I log those values to the screen and call a new function passing new city and state as parameters.
}

function getLatLonData(cityUpper, stateUpper) {
  const apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityUpper}&limit=7&appid=1f84100edd7f6cddf642b63a288eb2cd`;
  let statefound = false;
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

          let cities = JSON.parse(localStorage.getItem("cities")) || [];

          for (i = 0; i < data.length; i++) {
            if (data[i].state === stateUpper) {
              statefound = true;

              let lat = data[i].lat;
              let lon = data[i].lon;

              let existingCity = cities.find(
                (city) => city.fullName === cityUpper + " " + stateUpper
              );
              // Above, I added this code if a city already exists it will not be re-made.
              if (!existingCity) {
                let city = {
                  name: cityUpper,
                  state: stateUpper,
                  lati: lat,
                  long: lon,
                  fullName: cityUpper + " " + stateUpper
                };
                // Above, I do a for loop for the data so it can match the exact output im looking for.
                // Also, I check if the city alread exists in the city array. 
                cities.push(city);

                let citiesSerialized = JSON.stringify(cities);

                localStorage.setItem("cities", citiesSerialized);
                //Above, I log the data and save the object created from the data to local storage.

                let cityName = document.querySelector("#cityName");
                cityName.textContent = city.fullName;
                // Above, we set the text content of the main area to the city searched. 

    

                console.log(city);
                createCityBtn(city);
                getWeatherInfo(lat, lon, cityUpper, stateUpper);

              // Above, I create a button for that city and call get weather info.
                break;
              } else {
                console.log("City already exists:", cityUpper);
              }
              // Above, is a error if a city already exists.

            }
          }

          if (!statefound) {
            alert("State Not found!");
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

function getWeatherInfo(lat, lon, cityUpper, stateUpper) {
  const cityURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=1f84100edd7f6cddf642b63a288eb2cd`;
  // Above, I get the url to find precise location using lon and lat
  // Also, we pass in the city and state upper parameters to to store to local storage for our last search array. 

  let cities = cityList;
  let cityName = document.querySelector("#cityName");

  let lastSearches = JSON.parse(localStorage.getItem("lastSearches")) || [];
  lastSearches.push({ lat: lat, lon: lon, fullName: cityUpper + " " + stateUpper});
  localStorage.setItem("lastSearches", JSON.stringify(lastSearches));

  // It is also very important I set the last state searched even if we already checked if it is in the cities array.

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

  //  cities.forEach((city) => {
  //   if (city.lati === lat && city.long === lon) {
  //     cityName.textContent = city.fullName;
  //   }
  // });

  

 






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




















  
}

function createCityBtn(city) {
  cityBTN = document.createElement("button");
  cityBTN.classList.add(
    "col-12",
    "col-sm-11",
    "col-md-12",
    "citiesBtn",
    "btn-primary"
  );
  //Above, I created a button and gave it pre made classes,
  cityBTN.setAttribute("type", "button");
  cityBTN.textContent = city.name + " " + city.state;
  cityBTN.setAttribute("data-lat", city.lati);
  cityBTN.setAttribute("data-lon", city.long);

  // Above, I set the text content and gave the button some attributes.

  cityBTN.addEventListener("click", function (event) {
    displayOldCity(event); // Pass the event object to the displayOldCity function
  });

  //Above, I added a event listener to the button  and called displayoldcity.

  cityInput.append(cityBTN);

  // Last, I append the button to the cityInput section.
}

function renderlastSearch() {

  let lastSearch = JSON.parse(localStorage.getItem("lastSearches")) || [];
  let cities = cityList

  
  // Above, is where we use the last searches array. 
 // I retrieve the cities aray to render the buttons and the last searches array to render the last search. 
  

  console.log(lastSearch);

  if (cities.length > 0) {
    cities.forEach((city) => {

     createCityBtn(city)
    });
  } else {
    console.log("No cities in the list");


  }

  // Above, I create all the buttons after the page is refreshed. 


  if (lastSearch.length > 0){
  let lastSearchedCity = lastSearch[lastSearch.length - 1];

  let cityName = document.querySelector("#cityName");

  cityName.textContent = lastSearchedCity.fullName

   cityNameArray = lastSearchedCity.fullName.split(" ");
    let cityUpper = cityNameArray[0];
   let stateUpper = cityNameArray[1];

// Above,  we use the last searched city array to render the last searched city.

    getWeatherInfo(lastSearchedCity.lat, lastSearchedCity.lon, cityUpper, stateUpper);
  };

// Above, we call get weather data to present the data for the last searched city. 
  
}

function displayOldCity(event) {
  event.preventDefault();
  event.stopPropagation();


 

  
  const lat = event.target.getAttribute("data-lat");
  const lon = event.target.getAttribute("data-lon");
// Above, i get the lat and lon set to that buttons data attributes. 
  
  let cityName = document.querySelector("#cityName");

  cityName.textContent = event.target.textContent;

  let cityNameArray = event.target.textContent.split(" ");
  let cityUpper = cityNameArray[0];
  let stateUpper = cityNameArray[1];



 // Above, I set the text content of the main area to the event button city name.
 // Also, we get the sity and state upper values again.


  getWeatherInfo(lat, lon, cityUpper,stateUpper);

  // Above, I call the function get weather info to display the new data for the searched button clicked.
  
}

$(document).ready(function () {
  // Handler for .ready() called.

  renderlastSearch();

  // I called render last search first.
  displaydate();
  searchButton.addEventListener("click", getValue);
  // Above, I call display date to display the dates and add an event listener to the submit button. 
});
