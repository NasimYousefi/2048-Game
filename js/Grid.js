

// Game constants
const gridSize = 4
const cellSize = 10
const cellGap = 1

// Get player name
const playerName = sessionStorage.getItem('playerName');
let score = 0;
let bestScore;

// Get stored best score for player
let storedBest = localStorage.getItem(playerName);

if(storedBest) {
  bestScore = parseInt(storedBest); 
}else{
    bestScore = 0
}
document.getElementById('best-score-value').textContent =  bestScore;

// Grid class represents the game board
export default class Grid{
    constructor(gridElement) {
        // Set CSS grid properties based on constants
        gridElement.style.setProperty("--grid-size", gridSize)
        gridElement.style.setProperty("--cell-size", `${cellSize}vmin` )
        gridElement.style.setProperty("--cell-gap", `${cellGap}vmin` )

        // Generate cells
        this.cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(
                cellElement, 
                index % gridSize, 
                Math.floor(index / gridSize)
                )
        })
    }

    // Getter for cells arranged by column
    get cellsByColumn(){
        return this.cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x ] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }

    // Getter for cells arranged by row
    get cellsByRow(){
        return this.cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y ] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }

    // Getter for empty cells
    get emptyCells(){
        return this.cells.filter(cell => cell.tile == null)
    }

    // Pick random empty cell
    randomEmptyCell(){
        const randomIndex = Math.floor(Math.random() * this.emptyCells.length)
        return this.emptyCells[randomIndex]
    }
}


// Cell class represents each tile on the grid
class Cell {
    constructor (cellElement ,x, y){
        this.cellElement = cellElement
        this.x = x
        this.y = y 
    }

     // Tile getter and setter 
    get tile(){
        return this._tile
    }

    set tile(value){
        this._tile = value
        if(value == null) return
        this._tile.x = this.x
        this._tile.y = this.y
    }

    // Merge tile getter and setter
    get mergeTile(){
        return this._mergeTile
    }

    set mergeTile(value){
        this._mergeTile = value
        if (value == null) return
        this._mergeTile.x = this.x
        this._mergeTile.y = this.y
    }


    // Check if cell can accept a tile
    canAccept(tile){
        return (this.tile == null || 
            (this.mergeTile == null && this.tile.value === tile.value)
        )
    }


     // Handle tile merge logic
    mergeTiles(){
        // Merge tile values
        if (this.tile == null || this.mergeTile == null) return
        this.tile.value = this.tile.value + this.mergeTile.value
        // Remove merged tile
        this.mergeTile.remove()
        this.mergeTile = null
       
        // Update score
        score += this.tile.value
        updateScore();
        
       
// Display points earned
const points = document.createElement('div');
  points.textContent ="+" + this.tile.value;
  
  document.getElementById('points').append(points);
  
  points.classList.add('pop');

  setTimeout(() => points.remove(), 1000);
    }

    
}


// Create cell elements on the game grid
function createCellElements (gridElement) {
    let cells = []
for (let i=0; i<gridSize*gridSize; i++){
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.append(cell)
}
return cells
}


// Update current and best score displays
function updateScore() {
    document.getElementById('score-value').textContent = score;
    if(score > bestScore) {
      bestScore = score;
      localStorage.setItem(playerName, bestScore);
      document.getElementById('best-score-value').textContent =  bestScore;

      document.getElementById("new-record").style.display = "block";
    }
  }

const resetButton = document.getElementById('play-again')
resetButton.addEventListener('click', () => {
    score = 0
})

const replayBtn = document.getElementById('replay');
replayBtn.addEventListener('click', () => {
    score = 0
})