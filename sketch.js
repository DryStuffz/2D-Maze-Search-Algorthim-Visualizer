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
  for (var i = 0; i < moveHistory.length - 1; i++) {
    line(moveHistory[i].x * w + w / 2, moveHistory[i].y * w + w / 2, moveHistory[i].parent.x * w + w / 2, moveHistory[i].parent.y * w + w / 2);
  }




}








class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper Methods
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  // Removing an element will remove the
  // top element with highest priority then
  // heapifyDown will be called
  remove() {
    if (this.heap.length === 0) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown();
    return item;
  }

  add(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.parent(index).cost > this.heap[index].cost) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (this.hasRightChild(index) && this.rightChild(index).cost < this.leftChild(index).cost) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.heap[index].cost < this.heap[smallerChildIndex].cost) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.parent = null;
    this.cost = null;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }

  equals(coord2) {
    if (!(coord2 instanceof Coords)) {
      return false;
    }
    return (coord2.x === this.x && coord2.y === this.y);
  }

}





function possibleMoves(currentLocation) {

  // console.log(rows, columns);
  // console.log(currentLocation.toString());
  // console.log("-------------------------------");

  let moves = [];
  if (currentLocation.x >= 0 && currentLocation.x <= columns - 1 && currentLocation.y + 1 >= 0 && currentLocation.y + 1 <= rows - 1) {
    if (board[currentLocation.x][currentLocation.y + 1] != 1) {
      moves.push(new Coords(currentLocation.x, currentLocation.y + 1));
    }
  }
  if (currentLocation.x - 1 >= 0 && currentLocation.x - 1 <= columns - 1 && currentLocation.y >= 0 && currentLocation.y <= rows - 1) {
    if (board[currentLocation.x - 1][currentLocation.y] != 1) {
      moves.push(new Coords(currentLocation.x - 1, currentLocation.y));
    }
  }
  if (currentLocation.x >= 0 && currentLocation.x <= columns - 1 && currentLocation.y - 1 >= 0 && currentLocation.y - 1 <= rows - 1) {
    if (board[currentLocation.x][currentLocation.y - 1] != 1) {
      moves.push(new Coords(currentLocation.x, currentLocation.y - 1));
    }

  }
  if (currentLocation.x + 1 >= 0 && currentLocation.x + 1 <= columns - 1 && currentLocation.y >= 0 && currentLocation.y <= rows - 1) {
    if (board[currentLocation.x + 1][currentLocation.y] != 1) {
      moves.push(new Coords(currentLocation.x + 1, currentLocation.y));
    }
  }

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
  let algorthims = document.getElementById("Algorthims");
  const selectedAlgo = algorthims.value;


  var sp = getStartingPoint();
  eraseAttempted();
  if (sp != -1) {

    if (selectedAlgo == "DFS") {
      depthFirstSearch(board, sp);
    }
    else if (selectedAlgo == "BFS") {
      breadthFirstSearch(board, sp);
    }
    else if(selectedAlgo == "Greedy"){
      greedy(board, sp);
    }

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


    //toVisit.toString();
    console.log(...toVisit);

    //console.log(...toVisit.toList());
    visitedCoords.add(currentMove.toString());
    //moveHistory.push(currentMove);


    if (board[currentMove.x][currentMove.y] == end_point) {
      console.log("FOUND!!!!!!!!");
      moveHistory.add(currentMove);
      return moveHistory;
    }

    //coloring
    if (board[currentMove.x][currentMove.y] == empty || board[currentMove.x][currentMove.y] == unexplored) {
      board[currentMove.x][currentMove.y] = explored;
    }

    //coloring explored and unexplored
    for (var i = 0; i < toVisit.length; i++) {
      if (board[toVisit[i].x][toVisit[i].y] == empty) {
        board[toVisit[i].x][toVisit[i].y] = unexplored;
      }

    }

    let bestPath = currentMove;
    moveHistory = [];
    while (bestPath.parent !== null) {
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




async function breadthFirstSearch(board, startPoint) {


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


    //toVisit.toString();
    console.log(...toVisit);

    //console.log(...toVisit.toList());
    visitedCoords.add(currentMove.toString());
    //moveHistory.push(currentMove);


    if (board[currentMove.x][currentMove.y] == end_point) {
      console.log("FOUND!!!!!!!!");
      moveHistory.add(currentMove);
      return moveHistory;
    }

    //coloring
    if (board[currentMove.x][currentMove.y] == empty || board[currentMove.x][currentMove.y] == unexplored) {
      board[currentMove.x][currentMove.y] = explored;
    }

    //coloring explored and unexplored
    for (var i = 0; i < toVisit.length; i++) {
      if (board[toVisit[i].x][toVisit[i].y] == empty) {
        board[toVisit[i].x][toVisit[i].y] = unexplored;
      }
    }

    let bestPath = currentMove;
    moveHistory = [];
    while (bestPath.parent !== null) {
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
        toVisit.unshift(1);
        toVisit[0] = nextMoves[i];
      }

    }


    counter++;

  }

  console.log("Search Finished!");

  return moveHistory;

}


function getManhattanDistance(coord1, coord2) {
  return abs(coord1.x - coord2.x) + abs(coord1.y - coord2.y)
}

function getEndPoints() {
  var epoints = [];
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      if (board[i][j] == end_point) {
        epoints.push(new Coords(i,j));
      }
    }
  }
  return epoints;


}

function getSmallestCost(start, endpoints){
  min = Infinity;
  for(var i = 0; i < endpoints.length; i++){
    temp = getManhattanDistance(start, endpoints[i]);
    if(temp < min){
      min = temp;
    }
  }

  return temp;
}

async function greedy(board, startPoint) {


  //WHY IS THE SET NOT WORKING LMFAO AHHHHHHHHHHHHHHHHHH
  let visitedCoords = new Set();
  // let toVisit = [];
  let pq = new MinPriorityQueue();
  let endpointz = getEndPoints();

  startPoint.cost = getSmallestCost(startPoint, endpointz);
  pq.add(startPoint);
  console.log("Starting search...");
  var counter = 0;
  while (pq.heap.length != 0) {
    var currentMove = pq.remove();

    // if(visitedCoords.has(currentMove.toString())){
    //   continue;
    // }

    await sleep(50);

    //console.log(...toVisit.toList());
    visitedCoords.add(currentMove.toString());
    //moveHistory.push(currentMove);


    if (board[currentMove.x][currentMove.y] == end_point) {
      console.log("FOUND!!!!!!!!");
      moveHistory.add(currentMove);
      return moveHistory;
    }

    //coloring
    if (board[currentMove.x][currentMove.y] == empty || board[currentMove.x][currentMove.y] == unexplored) {
      board[currentMove.x][currentMove.y] = explored;
    }

    //coloring explored and unexplored
    for (var i = 0; i < pq.heap.length; i++) {
      if (board[pq.heap[i].x][pq.heap[i].y] == empty) {
        board[pq.heap[i].x][pq.heap[i].y] = unexplored;
      }
    }

    let bestPath = currentMove;
    moveHistory = [];
    while (bestPath.parent !== null) {
      moveHistory.push(bestPath);
      bestPath = bestPath.parent;
    }


    var nextMoves = possibleMoves(currentMove);

    // console.log([...visitedCoords]);
    for (var i = 0; i < nextMoves.length; i++) {
      //console.log(nextMoves[i]);
      //console.log(!visitedCoords.has(nextMoves[i].toString()));
      if (!visitedCoords.has(nextMoves[i].toString())) {
        nextMoves[i].parent = currentMove;
        visitedCoords.add(nextMoves[i].toString());
        nextMoves[i].cost = getSmallestCost(nextMoves[i], endpointz);
        pq.add(nextMoves[i]);
        // toVisit.unshift(1);
        // toVisit[0] = nextMoves[i];
      }

    }


    counter++;

  }

  console.log("Search Finished!");

  return moveHistory;

}




