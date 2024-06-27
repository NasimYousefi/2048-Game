
// Tile class represents each tile on the grid
export default class Tile {
    constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4){
         // Create tile element 
        this.tileElement = document.createElement("div")
        this.tileElement.classList.add("tile")
        tileContainer.append(this.tileElement)
        // Initialize value
        this.value = value
    }

     // Value getter and setter
    get value(){
        return this._value
    }

    set value(v){
        this._value = v
        this.tileElement.textContent = v
        const power = Math.log2(v)
        const backgroundLightness = 100 - power * 9
        this.tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)
        this.tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`)
   }


   // Position getters and setters
   get x() {
    return this._x
  }

    set x(value){
        this._x = value
        this.tileElement.style.setProperty("--x", value)

    }

    get y() {
        return this._y
      }

    set y(value){
        this._y = value
        this.tileElement.style.setProperty("--y", value)
    }

    // Remove tile element
    remove(){
        this.tileElement.remove()
    }
    // Wait for transition to end
    waitForTransition(animation = false){
        return new Promise(resolve => {
            this.tileElement.addEventListener(
                animation ? "animationend" : "transitionend", 
                resolve,
                {
                once: true,
            })
        })
    }
}