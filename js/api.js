

// Make fetch request with timeout
export async function sendFechRequest(url){
  // Create abort controller
  let controller = new AbortController();
let fechTimeOver = setTimeout(() => controller.abort(), 5000);
let response = await fetch(url, {
  signal: controller.signal
});
if (response.ok){
  clearTimeout(fechTimeOver);
  const APIresult = await response.json();
  return APIresult;
}else{
  console.log("Aborted!")
}
}




// const API_KEY = 'MBH93zOHkIoj9mO__GjD2xArO08aTFcftGJZSyHh0Dk';
// const query = "nature"; 
// export async function getRandomImage() {
//   return  await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${API_KEY}`)
//     .then(response => response.json())
//     .then(data => data.urls.full)
//     .catch(err => {
//       return null; 
//     });
    
// }
