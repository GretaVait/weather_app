//-----------------------------------------------------------------------------
//------------------------------ VARIABLES ------------------------------------
//-----------------------------------------------------------------------------

const weatherLocation = document.querySelector('.weather__location');
const weatherIcon = document.querySelector('.weather__icon');
const weatherTemp = document.querySelector('.weather__temp');
const weatherDesc = document.querySelector('.weather__desc');
const currentDay = document.querySelector('.current-day');

const searchInput = document.querySelector('.search__input');
const searchForm = document.querySelector('.search__form');
let formError = document.querySelector('.error');

const date = new Date();
const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let temp;

//-----------------------------------------------------------------------------
//------------------------------ FUNCTIONS ------------------------------------
//-----------------------------------------------------------------------------

function getWeatherFromLocation(lat, long) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    const api = `${proxy}https://api.darksky.net/forecast/2da64978e80588604b92c85af09ab05d/${lat},${long}`;
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const {temperature, summary, icon} = data.currently;
            //Set DOM elements from the API
            temp = temperature;
            weatherTemp.textContent = Math.round(temp) + ' F';
            weatherDesc.textContent = summary;
            const timezone = data.timezone;
            weatherLocation.textContent = timezone.replace(/_/g, ' ');
            weatherIcon.setAttribute("src", `../images/${icon}.png`);
        })
        .catch(error => {
            console.log(error);
        })
}

//-----------------------------------------------------------------------------
//------------------------- FUNCTIONS END HERE --------------------------------
//-----------------------------------------------------------------------------

//Set current location
window.addEventListener('load', () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherFromLocation(position.coords.latitude, position.coords.longitude);
        });

    } else {
        alert("Please Allow Your Location!");
    }
});

//Search for location
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputValue = searchInput.value;

    GEO_API_KEY = "cabd08c7871a497f890994b5c6c39f31";

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=${GEO_API_KEY}`)
        .then (response => {
            return response.json();
        })
        .then (data => {
            getWeatherFromLocation(data.results[0].geometry.lat, data.results[0].geometry.lng);
        })
        .catch(error => {
            console.log(error);
        })
    
});

currentDay.textContent = `${monthsArray[date.getMonth()]} ${date.getDate()}`;

//Change temperature to celsius/fahrenheit
weatherTemp.addEventListener('click', () => {
    if (weatherTemp.textContent.includes('F')) {
        weatherTemp.textContent = Math.round((temp - 32) / 1.8) + ' C';
    } else {
        weatherTemp.textContent = Math.round(temp) +' F';
    }
});