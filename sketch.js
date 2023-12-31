const legendTogg = document.getElementById("toggleButton");
const content = document.getElementById("content");

legendTogg.addEventListener("click", function() {
    if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");
        legendTogg.style.backgroundColor = " #7ba098";
        legendTogg.style.color ="white";
    } else {
        content.classList.add("hidden");
        legendTogg.style.backgroundColor = "#F0F8EA";
        legendTogg.style.color ="black";
    }
});


const startButton = document.getElementById("startButton");
const slider = document.getElementById("slider");



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms * ((100 - slider.value)/100)));
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
colors = ["#F0F8EA", "#2B0504", "#F09400", "#0012D6", " #9D9C62", "#A8C686"]
let sp = null;
//CANVAS PORTION
function setup() {
  canvas = createCanvas(windowWidth , windowHeight);
  canvas.style('display', 'block');
  canvas.mouseClicked(addStart);

  columns = floor(width / w);
  rows = floor(height / w);

  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = empty;
    }
  }

}


function draw() {
  background(220);
  //noFill();
  fill(225);
  stroke(210);
  strokeWeight(1);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      fill(colors[board[i][j]])
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
  stroke("#010001")
  strokeWeight(10);
  for (var i = 0; i < moveHistory.length - 1; i++) {
    line(moveHistory[i].x * w + w / 2, moveHistory[i].y * w + w / 2, moveHistory[i].parent.x * w + w / 2, moveHistory[i].parent.y * w + w / 2);
  }
}




function addWall() {
  if (activeButtonId == "wall_button") {
    board[floor(mouseX / w)][floor(mouseY / w)] = wall;
  }
}

function eraseObjects() {
  if (activeButtonId == "erase_button") {
    board[floor(mouseX / w)][floor(mouseY / w)] = empty;
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
}

function addStart() {
  //bug occurs because when a click is out of bounds 
  //it removes the start p0int
  //so when we switch buttons, addStart runs

  //VERY INNEFFICIENT LETS TRY TO FIX
  // if (activeButtonId == "start_location_button") {
  //   for (var i = 0; i < columns; i++) {
  //     for (var j = 0; j < rows; j++) {
  //       if (board[i][j] == 2) {
  //         board[i][j] = 0;
  //       }
  //     }
  //   }
  //   board[floor(mouseX / w)][floor(mouseY / w)] = 2;
  // }

  if (activeButtonId == "start_location_button") {
    console.log("START" + sp);
    if (sp == null) {
      sp = new Coords(floor(mouseX / w), floor(mouseY / w));
    }
    else {
      moveHistory = [];
      eraseAttempted();
      if (board[sp.x][sp.y] == start_point) {
        board[sp.x][sp.y] = empty;
      }
      sp.x = floor(mouseX / w);
      sp.y = floor(mouseY / w);

    }
    board[floor(mouseX / w)][floor(mouseY / w)] = start_point;

  }

}


function addEnd() {
  if (activeButtonId == "end_location_button") {
    board[floor(mouseX / w)][floor(mouseY / w)] = end_point;
  }

}



//MAZE ALGORTHIMS


function possibleMoves(currentLocation) {
  let moves = [];
  if (currentLocation.x >= 0 && currentLocation.x <= columns - 1 && currentLocation.y + 1 >= 0 && currentLocation.y + 1 <= rows - 1 && board[currentLocation.x][currentLocation.y + 1] != wall) {
    moves.push(new Coords(currentLocation.x, currentLocation.y + 1));
  }
  if (currentLocation.x - 1 >= 0 && currentLocation.x - 1 <= columns - 1 && currentLocation.y >= 0 && currentLocation.y <= rows - 1 && board[currentLocation.x - 1][currentLocation.y] != wall) {
    moves.push(new Coords(currentLocation.x - 1, currentLocation.y));
  }
  if (currentLocation.x >= 0 && currentLocation.x <= columns - 1 && currentLocation.y - 1 >= 0 && currentLocation.y - 1 <= rows - 1 && board[currentLocation.x][currentLocation.y - 1] != wall) {
    moves.push(new Coords(currentLocation.x, currentLocation.y - 1));
  }
  if (currentLocation.x + 1 >= 0 && currentLocation.x + 1 <= columns - 1 && currentLocation.y >= 0 && currentLocation.y <= rows - 1 && board[currentLocation.x + 1][currentLocation.y] != wall) {
    moves.push(new Coords(currentLocation.x + 1, currentLocation.y));
  }
  return moves;
}

function getStartingPoint() {
  if (sp != null) {
    return sp;
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
    else if (selectedAlgo == "Greedy") {
      greedy(board, sp);
    }
    else if (selectedAlgo == "AStar") {
      AStar(board, sp);
    }
    console.log("MOVE HISTORY");
  }
  else {
    console.log("NO START FOUND");
  }


});

function path_helper(toVisit, currentMove, startPoint) {
  /*
  FUnction for the coloring of explored and unexplored nodes
  */
  if (board[currentMove.x][currentMove.y] == empty || board[currentMove.x][currentMove.y] == unexplored) {
    board[currentMove.x][currentMove.y] = explored;
  }

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
  moveHistory.push(startPoint);
}

async function depthFirstSearch(board, startPoint) {

  //WHY IS THE SET NOT WORKING LMFAO AHHHHHHHHHHHHHHHHHH

  let visitedCoords = new Set();
  let toVisit = [];

  toVisit.push(startPoint);
  console.log("Starting search...");
  //var counter = 0;
  while (toVisit.length != 0) {
    var currentMove = toVisit.pop();

    await sleep(200);
    //toVisit.toString();
    //console.log(...toVisit);
    //console.log(...toVisit.toList());
    visitedCoords.add(currentMove.toString());
    //moveHistory.push(currentMove);

    path_helper(toVisit, currentMove, startPoint);
    var nextMoves = possibleMoves(currentMove);
    //console.log([...visitedCoords]);
    for (var i = 0; i < nextMoves.length; i++) {
      // console.log(nextMoves[i]);
      // console.log(!visitedCoords.has(nextMoves[i].toString()));
      if (board[nextMoves[i].x][nextMoves[i].y] == end_point) {
        nextMoves[i].parent = currentMove;
        path_helper(toVisit, nextMoves[i], startPoint);
        return moveHistory;
      }
      if (!visitedCoords.has(nextMoves[i].toString())) {
        nextMoves[i].parent = currentMove;
        visitedCoords.add(nextMoves[i].toString());
        toVisit.push(nextMoves[i]);
      }
    }
  }
  console.log("Search Finisjhed!");
  return moveHistory;

}

async function breadthFirstSearch(board, startPoint) {

  let visitedCoords = new Set();
  let toVisit = [];

  toVisit.push(startPoint);
  //console.log("Starting search...");
  while (toVisit.length != 0) {
    var currentMove = toVisit.pop();
    await sleep(200);
    //console.log(...toVisit);
    visitedCoords.add(currentMove.toString());

    if (board[currentMove.x][currentMove.y] == end_point) {
      console.log("FOUND!!!!!!!!");
      path_helper(toVisit, currentMove, startPoint);
      return moveHistory;
    }
    path_helper(toVisit, currentMove, startPoint);

    //Add possible moves form that explored node
    var nextMoves = possibleMoves(currentMove);
    for (var i = 0; i < nextMoves.length; i++) {
      if (board[nextMoves[i].x][nextMoves[i].y] == end_point) {
        nextMoves[i].parent = currentMove;
        path_helper(toVisit, nextMoves[i], startPoint);
        return moveHistory;
      }
      if (!visitedCoords.has(nextMoves[i].toString())) {
        nextMoves[i].parent = currentMove;
        visitedCoords.add(nextMoves[i].toString());
        toVisit.unshift(1);
        toVisit[0] = nextMoves[i];
      }
    }
  }
  console.log("Search Finished!");
  return moveHistory;
}

function getManhattanDistance(coord1, coord2) {
  return abs(coord1.x - coord2.x) + abs(coord1.y - coord2.y)
}

//TODO MKAE MORE EFFICIENT
function getEndPoints() {
  var epoints = [];
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      if (board[i][j] == end_point) {
        epoints.push(new Coords(i, j));
      }
    }
  }
  return epoints;
}

function getSmallestCost(start, endpoints) {
  min = Infinity;
  for (var i = 0; i < endpoints.length; i++) {
    temp = getManhattanDistance(start, endpoints[i]);
    if (temp < min) {
      min = temp;
    }
  }
  return min;
}

async function greedy(board, startPoint) {
  let visitedCoords = new Set();
  // let toVisit = [];
  let pq = new MinPriorityQueue();
  let endpointz = getEndPoints();

  startPoint.cost = getSmallestCost(startPoint, endpointz);
  pq.add(startPoint);
  console.log("Starting search...");
  while (pq.heap.length != 0) {
    var currentMove = pq.remove();
    await sleep(200);

    visitedCoords.add(currentMove.toString());
    if (board[currentMove.x][currentMove.y] == end_point) {
      console.log("FOUND!!!!!!!!");
      path_helper(pq.heap, currentMove, startPoint);
      return moveHistory;
    }

    path_helper(pq.heap, currentMove, startPoint);
    var nextMoves = possibleMoves(currentMove);
    
    for (var i = 0; i < nextMoves.length; i++) {

      if (!visitedCoords.has(nextMoves[i].toString())) {
        nextMoves[i].parent = currentMove;
        visitedCoords.add(nextMoves[i].toString());
        nextMoves[i].cost = getSmallestCost(nextMoves[i], endpointz);
        pq.add(nextMoves[i]);
        
        
        console.log(nextMoves[i].toString(), nextMoves[i].cost)
        
      }
    }
  }
  console.log("Search Finished!");
  return moveHistory;
}

function getIndex(target,arr){
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i].toString() == target.toString()) {
      return i;
    }
  }

  return -1;
}
function removeFromArray(arr, elt) {
  // Could use indexOf here instead to be more efficient
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

async function AStar(board, startPoint) {
  let open = [];
  let closed = [];
  let ep = getEndPoints();
  //put start node in open list
  startPoint.cost = 0;
  startPoint.g = 0
  open.push(startPoint);

  while (open.length > 0) {

    var winner = 0;
    for (var i = 0; i < open.length; i++) {
      if (open[i].cost < open[winner].cost) {
        winner = i;
      }
    }

    var currentMove = open[winner];
    if (board[currentMove.x][currentMove.y] == end_point) {
      path_helper(open, currentMove, startPoint);
      return moveHistory;
    }

    removeFromArray(open, currentMove);
    closed.push(currentMove);
    await sleep(200);
    path_helper(open, currentMove, startPoint);

    var nextMoves = possibleMoves(currentMove);

    for (var i = 0; i < nextMoves.length; i++) {
      var neighbor = nextMoves[i];
      // Valid next spot?
      if (getIndex(neighbor, closed) == -1 && board[neighbor.x][neighbor.y] != wall) {
        var tempG = currentMove.g + getManhattanDistance(neighbor, currentMove);
        
        // Is this a better path than before?
        var newPath = false;
        if (getIndex(neighbor, open) != -1) {
          if (tempG < open[getIndex(neighbor,open)].g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          open.push(neighbor);
        }

        // Yes, it's a better path
        if (newPath) {
          var h = getSmallestCost(neighbor, ep);
          neighbor.cost = neighbor.g + h;
          neighbor.parent = currentMove;
        }
      }
    }
  }
}



