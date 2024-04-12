let searchInput = document.querySelector("#citySearch");
let searchButton = document.querySelector("#searchB");
searchButton.addEventListener("click", getValue);

function getValue(event) {
  event.preventDefault();
  let searchInputValue = searchInput.value;

  if (searchInputValue === "") {
    alert("Please pick a City!");
  }

  //getSearchData(searchInputValue)

  console.log(searchInputValue);

  searchInput.value = "";
}



function getSearchData(){
    console.log("hello")
}



