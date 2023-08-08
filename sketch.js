const startButton = document.getElementById("startButton");



let w = 30;
let rows;
let columns;
let board;
let checkbox;
var activeButtonId = null;
let locked = false;
var canvas;

const empty = 0;
const wall = 1;
const start_point = 2;
const end_point = 3;

//CANVAS PORTION
function setup() {
  canvas = createCanvas(1200, 600);

  canvas.mouseClicked(addStart);







  columns = floor(width / w);
  rows = floor(height / w);

  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {

      board[i][j] = 0;
    }
  }

  // checkbox = createCheckbox('label', false);
  // checkbox.changed(myCheckedEvent);



  //init();
}

function draw() {



  background(220);
  fill(225);
  stroke(0)
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == empty) {
        fill(225);
      }
      else if (board[i][j] == wall) {
        fill(255, 45, 34);
      }
      else if (board[i][j] == start_point) {
        fill(25, 80, 64);
      }
      else if (board[i][j] == end_point) {
        fill(34, 40, 91)
      }

      rect(i * w, j * w, w - 1, w - 1);
    }
  }




}


function addWall() {
  if (activeButtonId == "wall_button") {
    board[floor(mouseX / w)][floor(mouseY / w)] = 1;
  }
}

function eraseObjects() {
  if (activeButtonId == "erase_button") {
    board[floor(mouseX / w)][floor(mouseY / w)] = 0;
  }

}


function mouseDragged() {

  addWall();

  eraseObjects();



}


function mousePressed() {

  addWall();


  eraseObjects();

  addEnd();

  console.log(`(${floor(mouseX / w)}, ${floor(mouseY / w)})`);
  //var mvs = possibleMoves(new Coords(floor(mouseX / w), floor(mouseY / w)));
  // for (var i = 0; i < mvs.length; i++) {
  //   console.log(mvs[i].toString());
  // }

  //addStart();
}

function addStart() {
  //bug occurs because when a click is out of bounds 
  //it removes the start p0int
  //so when we switch buttons, addStart runs
  if (activeButtonId == "start_location_button") {
    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        if (board[i][j] == 2) {
          board[i][j] = 0;
        }
      }
    }
    board[floor(mouseX / w)][floor(mouseY / w)] = 2;

  }

}


function addEnd() {
  if (activeButtonId == "end_location_button") {

    board[floor(mouseX / w)][floor(mouseY / w)] = 3;
  }

}



//MAZE ALGORTHIMS

class Coords {
  constructor(firstValue, secondValue) {
    this.firstValue = firstValue;
    this.secondValue = secondValue;
  }

  toString() {
    return `(${this.firstValue},${this.secondValue})`;
  }

  equals(coord2) {
    if (!(coord2 instanceof Coords)) {
      return false;
    }
    return (coord2.firstValue === this.firstValue && coord2.secondValue === this.secondValue);
  }

  hashCode() {
    const prime = 7; // You can choose any prime number

    let hash = 17; // Start with a prime seed value
    hash = hash * prime + this.firstValue;
    hash = hash * prime + this.secondValue;

    return hash;
  }


}

class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    if (!this.isEmpty()) {
      return this.items.pop();
    }
  }

  peek() {
    if (!this.isEmpty()) {
      return this.items[this.items.length - 1];
    }
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  toString() {
    console.log(this.items);
  }
}





function possibleMoves(currentLocation) {
  let moves = []
  // console.log(rows, columns);
  // console.log(currentLocation.toString());
  // console.log("-------------------------------");


  if (currentLocation.firstValue + 1 >= 0 && currentLocation.firstValue + 1 <= columns - 1 && currentLocation.secondValue >= 0 && currentLocation.secondValue <= rows - 1) {
    if (board[currentLocation.firstValue + 1][currentLocation.secondValue] != 1) {
      moves.push(new Coords(currentLocation.firstValue + 1, currentLocation.secondValue));
    }
  }
  if (currentLocation.firstValue - 1 >= 0 && currentLocation.firstValue - 1 <= columns - 1 && currentLocation.secondValue >= 0 && currentLocation.secondValue <= rows - 1) {
    if (board[currentLocation.firstValue - 1][currentLocation.secondValue] != 1) {
      moves.push(new Coords(currentLocation.firstValue - 1, currentLocation.secondValue));
    }
  }
  if (currentLocation.firstValue >= 0 && currentLocation.firstValue <= columns - 1 && currentLocation.secondValue + 1 >= 0 && currentLocation.secondValue + 1 <= rows - 1) {
    if (board[currentLocation.firstValue][currentLocation.secondValue + 1] != 1) {
      moves.push(new Coords(currentLocation.firstValue, currentLocation.secondValue + 1));
    }
  }
  if (currentLocation.firstValue >= 0 && currentLocation.firstValue <= columns - 1 && currentLocation.secondValue - 1 >= 0 && currentLocation.secondValue - 1 <= rows - 1) {
    if (board[currentLocation.firstValue][currentLocation.secondValue - 1] != 1) {
      moves.push(new Coords(currentLocation.firstValue, currentLocation.secondValue - 1));
    }

  }

  // for (var i = -1; i < 2; i++) {
  //   for (var j = -1; j < 2; j++) {
  //     if (i != 0 || j != 0) {
  //       if (currentLocation.firstValue + i >= 0 && currentLocation.firstValue + i <= columns - 1 && currentLocation.secondValue + j >= 0 && currentLocation.secondValue + j <= rows - 1) {
  //         moves.push(new Coords(currentLocation.firstValue + i, currentLocation.secondValue + j));
  //       }
  //     }
  //   }
  // }


  return moves;
}


function getStartingPoint() {
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      if (board[i][j] == 2) {
        return new Coords(i, j);
      }
    }
  }
  return -1;

}
startButton.addEventListener("click", () => {
  //const selectedFruit = fruitSelect.value;
  var sp = getStartingPoint();
  if (sp != -1) {

    var moves = depthFirstSearch(board, sp);
    console.log("MOVE HISTORY");
    moves.forEach(move => {

      console.log(move.toString())
    });
  }
  else {
    console.log("NO START FOUND");
  }


});



function depthFirstSearch(board, startPoint) {



  let testSet = new Set();
  //WHY IS THE SET NOT WORKING LMFAO AHHHHHHHHHHHHHHHHHH
  let moveHistory = [];
  let visitedCoords = new Set();
  let toVisit = new Stack();

  toVisit.push(startPoint);
  console.log("SDtarting search...");
  var counter = 0;
  while (!toVisit.isEmpty()) {
    //toVisit.toString();
    var currentMove = toVisit.pop();
    visitedCoords.add(currentMove.toString());
    moveHistory.push(currentMove);

    if (board[currentMove.firstValue][currentMove.secondValue] == end_point) {
      console.log("FOUND!!!!!!!!");
      return moveHistory;
    }
    var nextMoves = possibleMoves(currentMove);
    for (var i = 0; i < nextMoves.length; i++) {
      if (!visitedCoords.has(nextMoves[i].toString())) {
        toVisit.push(nextMoves[i]);
      }

    }
    
    //toVisit.toString();
    counter++;

  }
  console.log(testSet.values());

  console.log("Search Finisjhed!");

  return moveHistory;

}