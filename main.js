const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let resolution = 10;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.width = 1000;
// canvas.height = 1000;
let cameraZoom = 1
// let MAX_ZOOM = 5
// let MIN_ZOOM = 0.1
// let SCROLL_SENSITIVITY = 0.0005

const cols = Math.floor(canvas.width / resolution);
const rows = Math.floor(canvas.height / resolution);

function buildGrid() {
  return new Array(cols).fill(null)
    .map( () => new Array(rows).fill(null)
      .map( () => 0)
      );
}

let grid = buildGrid();

// add clickable cell grid
//finding cell x y coordinates
canvas.addEventListener('click', e => {
 
  let map = canvas.getBoundingClientRect();
  // resolution has to be variable based on zoom (for example + 0.1)
  // or maybe its not good idea
  let cellX = Math.floor((e.clientX - map.left) / resolution)
  let cellY = Math.floor((e.clientY - map.top) / resolution)
  
  // grid[cellX][cellY] = 1;
  if (grid[cellX][cellY] === 0) {
    grid[cellX][cellY] = 1;
    console.log('cell : ', grid[cellX][cellY], 'x: ', cellX, 'y: ', cellY);
    return;
  }
  if (grid[cellX][cellY] === 1) {
    grid[cellX][cellY] = 0; 
    console.log('cell : ', grid[cellX][cellY], 'x: ', cellX, 'y: ', cellY);
    return;
  }

})

// game loop 
let start = false;

function update() {
  if (start) {
    grid = nextGen(grid);
  }
  render(grid);
}
const updateInterval = setInterval(update, 100);

function toggleStart() {
  start = !start;
}

// function updateZoomState() {
//   console.log('zoom: ', cameraZoom)
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.scale(cameraZoom, cameraZoom);
// }

function clr() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
}

addEventListener('keyup', e => {
  console.log(e.key)
 if (e.key === ' ') {
   toggleStart()
   console.log("game On : ", start)
 }
 if(e.key === 'ArrowUp') {
  // cameraZoom += 0.01;
  // updateZoomState();
  clr()
  ctx.scale(1.1, 1.1);
  // resolution += 0.1
 }
 if(e.key === 'ArrowDown') {
  //  cameraZoom -= 0.01;
  //  updateZoomState();
  clr()
  ctx.scale(0.9, 0.9);
  // resolution -= 0.1

 }
})



function nextGen(grid) {
  //copying the grid to new array
  // change generating new arr to changing old array for memory saving
  const nextGen = grid.map(arr => [...arr]);


  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row ++) {
      const cell = grid[col][row];
      let neighbours = 0;

      //inner loop for finding neighbours
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
         if (i === 0 && j === 0) {
           continue;
         }

         const xCell = col + i;
         const yCell = row + j;

          if(xCell >= 0 && yCell >= 0 && xCell < cols && yCell < rows) {

            const currentNeighbour = grid[col + i][row + j];
            neighbours += currentNeighbour;
  
          }
        }
      }
      
      //rules
      //underpopulation
      if (cell === 1 && neighbours < 2) {
        //kill cell
        nextGen[col][row] = 0; 
      }
      // overpopulation
      else if (cell === 1 && neighbours > 3) {
        nextGen[col][row] = 0;
      }
      else if (cell === 0 && neighbours === 3) {
        nextGen[col][row] = 1;
      }
      
    }
  }
  return nextGen;
}

let cellColor = '#5f5'

const colorInput = document.querySelector('#colorInput');
colorInput.addEventListener('change', () => {
  cellColor = colorInput.value;
})


function render(grid) {
  // repair the zoom
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row ++) {
      const cell = grid[col][row];
      // const color = Math.floor(Math.random() * 20 + 20);
      // const color = '22'


      ctx.strokeStyle = '#222';
     
        // console.log('alive')
        ctx.beginPath()
        
        // ctx.fillStyle = cellColor;
        ctx.rect(col * resolution, row * resolution, resolution, resolution);
        
        if (cell == 1) {
          // ctx.fillStyle = cell ? cellColor : 'black';
          ctx.fillStyle = cellColor;
          ctx.fill()
        }
        ctx.stroke();
        ctx.closePath();
      
      
    
    }
  }
}


function adjustZoom(zoomAmount, zoomFactor)
{
        if (zoomAmount)
        {
            cameraZoom += zoomAmount
        }
        else if (zoomFactor)
        {
            console.log(zoomFactor)
            cameraZoom = zoomFactor*lastZoom
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
        
        console.log(zoomAmount)

}



// canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY))