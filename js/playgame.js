
// Import necessary classes
import Grid from "./Grid.js"
import Tile from "./Tile.js"
import { sendFechRequest } from "./api.js";


// Get player name and display on screen
const playerName = sessionStorage.getItem('playerName');
const nameElem = document.getElementById('player-name-display');
nameElem.textContent =  playerName;


// Set up modal for game over
const modal = document.getElementById('game-over');


// Set up arrow button controls
const upBtn = document.getElementById('up-btn');
const leftBtn = document.getElementById('left-btn'); 
const downBtn = document.getElementById('down-btn');
const rightBtn = document.getElementById('right-btn');


// Default starting score
let defaultScore = 0 ;

// Set player avatar image based on name
let playerAvatar = document.getElementById('player-avatar');
let playerAvatarurl = `https://source.boringavatars.com/beam/90/${playerName}?colors=9D6C82,C17F8A,DD968E,9D6C82,C17F8A`

try {
  playerAvatar.src = playerAvatarurl; 
} catch (error) {
  console.log(error);
  playerAvatar.style.display='none'; 
}



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



// Create game grid and initially empty cells
const gameBoard = document.getElementById("game-board")
const grid = new Grid(gameBoard)



// Restore previously saved tiles when page loads
window.addEventListener('load', () => {
  restoreTiles();
  window.removeEventListener('load', restoreTiles); 
});

setupInput()

// Set up keyboard input handling
function setupInput(){
    window.addEventListener ( "keydown", handleInput, {once : true})
}


// Handle each arrow key press
async function handleInput(e) {
    
    switch (e.key){
        case "ArrowUp":
            if (!canMoveUp()){
                setupInput();
                saveTiles(); 
                return
            }
            await moveup();
            break

        case "ArrowDown":
            if (!canMoveDown()){
                setupInput();
                saveTiles(); 
                return
            }
            await movedown();
            break

        case "ArrowLeft":
            if (!canMoveLeft()){
                setupInput();
                saveTiles(); 
                return
            }
            await moveleft();
            break

        case "ArrowRight":
            if (!canMoveRight()){
                setupInput(); 
                 saveTiles(); 
                return
            }
            await moveright();
            break

        default : 
        setupInput();
        saveTiles(); 
        return
    }

    grid.cells.forEach(cell => cell.mergeTiles())
    
    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    // Check for game over
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
        newTile.waitForTransition(true).then(() =>{
            modal.style.display = "block"
            document.getElementById("showFainalScore").innerHTML="Your Score is "+sessionStorage.getItem('savedscore')
            // alert("You lose")
        })
        return
    }

        setupInput();
        saveTiles(); 
    
}



// Define helper functions to slide tiles in each direction 
function moveup(){
    return slideTiles(grid.cellsByColumn)
}

function movedown(){
    return slideTiles(grid.cellsByColumn.map(column =>[...column].reverse()))
}

function moveleft(){
    return slideTiles(grid.cellsByRow)
}

function moveright(){
    return slideTiles(grid.cellsByRow.map(Row =>[...Row].reverse()))
}


// Slide tiles in the given cell groups
function slideTiles(cells){
  // Use Promise.all to wait for all tile transitions
    return Promise.all(
// Map through each cell group (row or column)
cells.flatMap(group => {
    const promises = []
    for (let i = 1; i < group.length; i++){
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i-1; j>=0; j--){
            const moveToCell = group[j]
            if (!moveToCell.canAccept(cell.tile)) break
            lastValidCell = moveToCell
        }
        if (lastValidCell != null){
            promises.push(cell.tile.waitForTransition())
            if (lastValidCell.tile != null ){
                lastValidCell.mergeTile = cell.tile
            }else{
                lastValidCell.tile = cell.tile
            }
            // Remove tile from original cell 
            cell.tile = null
        }
    }
    return promises
}));
}

// Check if can move in each direction
function canMoveUp(){
    return canMove(grid.cellsByColumn)
}

function canMoveDown(){
    return canMove(grid.cellsByColumn.map(column =>[...column].reverse()))
}

function canMoveLeft(){
    return canMove(grid.cellsByRow)
}

function canMoveRight(){
    return canMove(grid.cellsByRow.map(row =>[...row].reverse()))
}

// Check if any cell in group can move
function canMove (cells){
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}

// Get reset button element 
const resetButton = document.getElementById('play-again')
resetButton.addEventListener('click', () => {
  // Remove previous tile elements
    gameBoard.querySelectorAll('.tile').forEach(tile => {
        tile.remove() 
      })

    // Clear cell tiles and merges
    grid.cells.forEach(cell => {
      cell.tile = null
      cell.mergeTile = null
    })

    // Reset score and clear saved state
    sessionStorage.removeItem("tiles");
    sessionStorage.removeItem('savedscore');
    document.getElementById('score-value').textContent = 0
    
    // Add new starting tiles
    grid.randomEmptyCell().tile = new Tile(gameBoard) 
    grid.randomEmptyCell().tile = new Tile(gameBoard)
  
    
    setupInput()
  
  })


// Save current board state to sessionStorage
function saveTiles() {

    const tiles = [];
    grid.cells.forEach(cell => {
      if (cell.tile) {
        tiles.push({
          x: cell.x,
          y: cell.y, 
          value: cell.tile.value
        });
      }
    });
     // Get current score
    const savedscore = document.getElementById('score-value').innerHTML;

    // Save tiles array and score to sessionStorage
    sessionStorage.setItem('tiles', JSON.stringify(tiles));
    sessionStorage.setItem('savedscore',savedscore)
  
  }
  
  // Restore board state
  function restoreTiles() {
  // Get saved tiles array
    const storedTiles = JSON.parse(sessionStorage.getItem('tiles'));
    
    if(storedTiles){
    // Add each saved tile to board
    storedTiles.forEach(tile => {
      const cell = grid.cells.find(c => c.x === tile.x && c.y === tile.y);
      cell.tile = new Tile(gameBoard, tile.value); 
    });

    // Restore saved score
    document.getElementById('score-value').innerHTML=sessionStorage.getItem('savedscore')
  }else{
    // No saved state, add starting tiles
    grid.randomEmptyCell().tile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = new Tile(gameBoard)
  }
  }



// Get replay button and add click handler
  const replayBtn = document.getElementById('replay');
  replayBtn.addEventListener('click', restartGame);
  

  // Restart game handler
  function restartGame() {
    const modal = document.getElementById('game-over');
    modal.style.display = "none";

     // Remove previous tiles
    gameBoard.querySelectorAll('.tile').forEach(tile => {
        tile.remove() 
      })

      // Reset each cell
    grid.cells.forEach(cell => {
      cell.tile = null;
      cell.mergeTile = null;
    });
    // Reset score and clear state
    sessionStorage.removeItem("tiles");
    sessionStorage.removeItem("savedscore");
    document.getElementById('score-value').textContent = defaultScore;
  
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    
    setupInput();
  
  }

// Bind arrow button clicks to input handle
upBtn.addEventListener('click', () => handleInput({key: 'ArrowUp'}));
leftBtn.addEventListener('click', () => handleInput({key: 'ArrowLeft'}));
downBtn.addEventListener('click', () => handleInput({key: 'ArrowDown'}));  
rightBtn.addEventListener('click', () => handleInput({key: 'ArrowRight'}));

  