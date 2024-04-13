let searchInput = document.querySelector("#citySearch");
let searchButton = document.querySelector("#searchB");
searchButton.addEventListener("click", getValue);

function getValue(event) {
  event.preventDefault();
  let searchInputValue = searchInput.value;

  if (searchInputValue !== "" && searchInputValue.includes(",")) {
    cityAndState = searchInputValue.split(",");
    city = cityAndState[0];
    state = cityAndState[1];

    cityUpper = city[0].toUpperCase() + city.slice(1);
    stateUpper = state[0].toUpperCase() + state.slice(1);
  } else {
    alert("Please pick a City , State !");
  }

  console.log(cityUpper);
  console.log(stateUpper);

  getLatLonData(cityUpper, stateUpper);

  searchInput.value = "";
}

function getLatLonData(cityUpper, stateUpper) {
  const apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityUpper}&limit=5&appid=1f84100edd7f6cddf642b63a288eb2cd`;
  let statefound = false;

  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (data.length === 0) {
            alert("Error City Not Found!");
          } else {
            console.log(data);
          }

          for (i = 0; i < data.length; i++) {
            if (data[i].state === stateUpper) {
              statefound = true;
              const lat = data[i].lat;
              const lon = data[i].lon;

              console.log(lat, lon);
              //getWeatherInfo(lat,lon);
            }

            if (!statefound) {
              alert("State Not found!");
              break;
            }
          }
        });
      }
    })

    .catch(function (error) {
      alert("Unable to connect to server!");
    });
};


function getWeatherInfo(){
    console.log("hello")








}

getWeatherInfo()