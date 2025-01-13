const $mainTimeDate = document.querySelector(".date-time");
const $date = document.querySelector(".date-time > .date");
const $time = document.querySelector(".date-time > .time");
const $cityInput = document.querySelector(".input__data > input");
const $city = document.querySelector(".weather__data > .city");
const $degrees = document.querySelector(".weather__data > .degrees");
const $weatherBtn = document.querySelector(".input.button");
const API_URL = "http://api.weatherapi.com/v1/current.json?key";
const API_KEY = "22f4ebce6e8441e3a9e215839242512";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const regHasNumbers = /\d/;
let currentCity;

const getData = async () => {
  try {
    const response = await fetch(`${API_URL}=${API_KEY}&q=${currentCity}`);

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error.message);
      return;
    }

    let result = await response.json();
    renderCityWeather(result.location.name, result.current.temp_c);
  } catch (error) {
    alert("Something went wrong ;-(");
    console.error(error);
  }
};

const renderCityWeather = (location, temp) => {
  $city.innerHTML = location;
  $degrees.innerHTML = temp + "\u2103";
};

const getTimeDate = () => {
  // Юзай new Intl.DateTimeFormat
  const date = new Date();
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const dayName = days[date.getDay() - 1];
  const today = year + ", " + day + " " + month + ", " + dayName;

  const currentTime = [
    `0${date.getHours()}`,
    `0${date.getMinutes()}`,
    `0${date.getSeconds()}`,
  ]
    .map((item) => item.slice(-2))
    .join(" : ");

  renderTimeDate(today, currentTime);
};

const setCurrentTimeDate = () => {
  setInterval(() => {
    getTimeDate();
  }, 50);
};

const renderTimeDate = (today, time) => {
  $date.innerHTML = "";
  $time.innerHTML = "";

  $date.innerText = today;
  $time.innerText = time;
};

const getCurrentCity = () => {
  if (regHasNumbers.test($cityInput.value)) {
    alert(`You can't use numbers.`);
    $cityInput.value = "";
    return;
  }
  if (!$cityInput.value) {
    return;
  }

  $cityInput.value = $cityInput.value.toLowerCase();
  $cityInput.value =
    $cityInput.value[0].toUpperCase() + $cityInput.value.slice(1);
  currentCity = $cityInput.value;
  $cityInput.value = "";
  getData();
};

getTimeDate();

const currentGeolocation = () => {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    currentCity = latitude + " " + longitude;
    getData();
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
};

currentGeolocation();

const render = () => {
  setCurrentTimeDate();
  if (currentCity) {
    getCurrentCity();
  }
};

$weatherBtn.addEventListener("click", getCurrentCity);
$cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getCurrentCity();
  }
});

// test commentary

render();
