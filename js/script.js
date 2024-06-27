

import { sendFechRequest } from "./api.js";

// Array of background images
const backimg =[
  '../assets/Wallpaper.jpg',
  '../assets/1.jpg',
  '../assets/2.jpg',
  '../assets/3.jpg',
  '../assets/4.jpg',
  '../assets/5.jpeg',
  '../assets/6.jpg',
  '../assets/7.jpg',
  '../assets/8.jpg'
]
const randomIndex = Math.floor(Math.random() * backimg.length);
const randomImage = backimg[randomIndex];


// API call to get random image from Unsplash
// Set as background image or use default if API fails
const API_KEY = 'MBH93zOHkIoj9mO__GjD2xArO08aTFcftGJZSyHh0Dk';
const query = "nature"; 

const randombackgroundurl = `https://api.unsplash.com/photos/random?query=${query}&client_id=${API_KEY}`
sendFechRequest(randombackgroundurl)
.then(response => {
  document.body.style.backgroundImage = `url(${response.urls.full})`; 
  document.body.style.backgroundSize="cover";
  document.body.style.backgroundPosition="center";
})
.catch((error)=>{
  document.body.style.backgroundImage=`url("${randomImage}")`;
  document.body.style.backgroundSize="cover";
  document.body.style.backgroundPosition="center";
})



// Get DOM elements
const scoreButton = document.getElementById("score");
const playGameButton = document.getElementById("play-game");

 
// Handle score button click
scoreButton.addEventListener("click", () => goToScorePage("scores.html"));

// Handle play button click
playGameButton.addEventListener("click", () => {

   // Clear previous game state
  sessionStorage.removeItem("tiles");
  sessionStorage.removeItem('savedscore')

  // Get and store player name
const playerName = document.getElementById("player-name").value;
const playerNameFirstLetterUperCase = playerName[0].toUpperCase()+playerName.slice(1).toLowerCase()
sessionStorage.setItem('playerName', playerNameFirstLetterUperCase); 

 // Change to game page
changeUrl(); 
})



// Handle enter keypress
window.addEventListener('keypress', function(event) {
  if (event.key === 'Enter'){
    sessionStorage.removeItem("tiles");
    sessionStorage.removeItem('savedscore')
    const playerName = document.getElementById("player-name").value;
    const playerNameFirstLetterUperCase = playerName[0].toUpperCase()+playerName.slice(1).toLowerCase()
    sessionStorage.setItem('playerName', playerNameFirstLetterUperCase); 
    changeUrl()}
  })

// Redirect to a page
function  goToScorePage(value) {
  const url = new URL(value, window.location.origin);
  window.location.href = url;
}


// Construct new URL and redirect
function changeUrl() {
  const changePage = window.location.href;
  let newUrl = new URL(changePage);
  newUrl.pathname ="playgame.html";
  newUrl.searchParams.set("name", sessionStorage.getItem('playerName'));
  window.location.href = newUrl.href;
}