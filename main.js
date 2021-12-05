const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;

canvas.width = 800;
canvas.height = 800;

const cols = canvas.width / resolution;
const rows = canvas.height / resolution;

function buildGrid() {
  return new Array(cols).fill(null)
    .map( () => new Array(rows).fill(null)
      .map( () => Math.floor(Math.random() * 2)));
}

let grid = buildGrid();


function update() {
  grid = nextGen(grid);
  render(grid);
  requestAnimationFrame(update);
}
requestAnimationFrame(update)

function nextGen(grid) {
  //copying the grid to new array
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

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row ++) {
      const cell = grid[col][row];
      const color = Math.floor(Math.random() * 20 + 20);
      ctx.strokeStyle = '#222';
      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? `hsla(${color}, 100%, 50%)` : 'black';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    
    }
  }
}