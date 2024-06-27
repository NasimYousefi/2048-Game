
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




// Get scores from localStorage
let scores = [];


for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);

  // Parse the JSON string into an object
  
  let scoreObject = { key, value };
  scores.push(scoreObject);

}


// Sort scores array from largest to smallest
scores.sort((a, b) => {
  return parseInt(b.value) - parseInt(a.value); 
});



// Create HTML table
let html = '<table><tr><th>Name</th><th>Score</th></tr>';

// Add each score to the HTML
for (let i = 0; i < scores.length; i++) {
   const avatarURL = `https://source.boringavatars.com/beam/60/${scores[i].key}?colors=9D6C82,C17F8A,DD968E,9D6C82,C17F8A`
  html += '<tr>';

  html +=`<td><img src="${avatarURL}" id=avatar onerror="this.style.display='none'" />  ${scores[i].key}</td>`
  html += `<td>${scores[i].value}</td>`

  html += '</tr>';
}

html += '</table>';

// Output scores HTML
document.getElementById('scores').innerHTML = html;




