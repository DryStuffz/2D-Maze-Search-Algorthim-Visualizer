const startButton = document.getElementById("startButton");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



let w = 30;
let rows;
let columns;
let board;
let checkbox;
var activeButtonId = null;
let locked = false;
var canvas;
let moveHistory = [];
const empty = 0;
const wall = 1;
const start_point = 2;
const end_point = 3;
const explored = 4;
const unexplored = 5;

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

  // let c1 = new Coords(0,0);
  // let c2 = new Coords(1,0); 
  // let c3 = new Coords(1,7); 
  // let c4 = new Coords(6,7); 
  // c4.parent = c3;
  // c3.parent = c2;
  // c2.parent = c1;
  // let coordz = [c4,c3,c2,c1];
  // let test = new Set();
  // test.add(c1.toString());
  // test.add(c2.toString());
  // test.add(c3.toString());

  // console.log(test.has(coordz[0].toString()));
  // console.log(test.has(coordz[1].toString()));
  // console.log(test.has(coordz[2].toString()));
  // console.log(test.has(coordz[3].toString()));
  // checkbox = createCheckbox('label', false);
  // checkbox.changed(myCheckedEvent);
  
}






function draw() {
  background(220);
  //noFill();
  


  
  fill(225);
  stroke(0);
  strokeWeight(1);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == empty) {
        fill(225);
      }
      else if (board[i][j] == wall) {
        fill("#000000");
      }
      else if (board[i][j] == start_point) {
        fill("#AD7800");
      }
      else if (board[i][j] == end_point) {
        fill("#0D087A")
      }
      else if (board[i][j] == explored) {
        fill("#BBB093");
      }
      else if (board[i][j] == unexplored) {
        fill("#98D095");
      }

      rect(i * w, j * w, w - 1, w - 1);
    }
  }


  strokeWeight(5);  


  // let c1 = new Coords(0,0);
  // let c2 = new Coords(1,0); 
  // let c3 = new Coords(1,7); 
  // let c4 = new Coords(6,7); 
  // c4.parent = c3;
  // c3.parent = c2;
  // c2.parent = c1;
  // let coordz = [c4,c3,c2,c1];
  for(var i=0; i < moveHistory.length -1; i++){
    line(moveHistory[i].firstValue *w + w/2, moveHistory[i].secondValue*w + w/2, moveHistory[i].parent.firstValue*w+ w/2, moveHistory[i].parent.secondValue*w+ w/2);
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


function eraseAttempted() {
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      if (board[i][j] == 4 || board[i][j] == 5) {
        board[i][j] = 0;
      }
    }
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
    this.parent = null;
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





function possibleMoves(currentLocation) {
  
  // console.log(rows, columns);
  // console.log(currentLocation.toString());
  // console.log("-------------------------------");

  let moves= [];
  if (currentLocation.firstValue >= 0 && currentLocation.firstValue <= columns - 1 && currentLocation.secondValue + 1 >= 0 && currentLocation.secondValue + 1 <= rows - 1) {
    if (board[currentLocation.firstValue][currentLocation.secondValue + 1] != 1) {
      moves.push(new Coords(currentLocation.firstValue, currentLocation.secondValue + 1));
    }
  }
  if (currentLocation.firstValue - 1 >= 0 && currentLocation.firstValue - 1 <= columns - 1 && currentLocation.secondValue >= 0 && currentLocation.secondValue <= rows - 1) {
    if (board[currentLocation.firstValue - 1][currentLocation.secondValue] != 1) {
      moves.push(new Coords(currentLocation.firstValue - 1, currentLocation.secondValue));
    }
  }
  if (currentLocation.firstValue >= 0 && currentLocation.firstValue <= columns - 1 && currentLocation.secondValue - 1 >= 0 && currentLocation.secondValue - 1 <= rows - 1) {
    if (board[currentLocation.firstValue][currentLocation.secondValue - 1] != 1) {
      moves.push(new Coords(currentLocation.firstValue, currentLocation.secondValue - 1));
    }

  }
  if (currentLocation.firstValue + 1 >= 0 && currentLocation.firstValue + 1 <= columns - 1 && currentLocation.secondValue >= 0 && currentLocation.secondValue <= rows - 1) {
    if (board[currentLocation.firstValue + 1][currentLocation.secondValue] != 1) {
      moves.push(new Coords(currentLocation.firstValue + 1, currentLocation.secondValue));
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


  //return shuffle(moves);
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
  //moveHistory = [];
  //const selectedFruit = fruitSelect.value;
  var sp = getStartingPoint();
  eraseAttempted();
  if (sp != -1) {

    var moves = depthFirstSearch(board, sp);
    console.log("MOVE HISTORY");
    // moves.forEach(move => {

    //   console.log(move.toString())
    // });
  }
  else {
    console.log("NO START FOUND");
  }


});



async function depthFirstSearch(board, startPoint) {



  let testSet = new Set();
  //WHY IS THE SET NOT WORKING LMFAO AHHHHHHHHHHHHHHHHHH
  
  let visitedCoords = new Set();
  let toVisit = [];

  toVisit.push(startPoint);
  console.log("Starting search...");
  var counter = 0;
  while (toVisit.length != 0) {
    var currentMove = toVisit.pop();
    // if(visitedCoords.has(currentMove.toString())){
    //   continue;
    // }
    await sleep(50);
    moveHistory = [];
    
    //toVisit.toString();
   console.log(...toVisit);
    
    //console.log(...toVisit.toList());
    visitedCoords.add(currentMove.toString());
    //moveHistory.push(currentMove);


    if (board[currentMove.firstValue][currentMove.secondValue] == end_point) {
      console.log("FOUND!!!!!!!!");
        return moveHistory;
    }

    //coloring
    if (board[currentMove.firstValue][currentMove.secondValue] == empty || board[currentMove.firstValue][currentMove.secondValue] == unexplored) {
      board[currentMove.firstValue][currentMove.secondValue] = explored;
    }

    //coloring explored and unexplored
    for (var i = 0; i < toVisit.length; i++) {
      if (board[toVisit[i].firstValue][toVisit[i].secondValue] == empty) {
        board[toVisit[i].firstValue][toVisit[i].secondValue] = unexplored;
      }

    }

    let bestPath = currentMove;

    while(bestPath.parent !==  null){
      moveHistory.push(bestPath);
      bestPath = bestPath.parent;
    }


    var nextMoves = possibleMoves(currentMove);
    
    console.log([...visitedCoords]);
    for (var i = 0; i < nextMoves.length; i++) {
      console.log(nextMoves[i]);
      console.log(!visitedCoords.has(nextMoves[i].toString()));
      if (!visitedCoords.has(nextMoves[i].toString())) {
        nextMoves[i].parent = currentMove;
        visitedCoords.add(nextMoves[i].toString());
        toVisit.push(nextMoves[i]);
      }

    }
 

    counter++;

  }

  console.log("Search Finisjhed!");

  return moveHistory;

}




