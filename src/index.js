import "./css/hex-svg.css";

const levels=[
    {'level':0,'name':'level0','maxScore':7,'map':[
        {'row':13,'col':13,'type':'black'},
    ]},
    {'level':1,'name':'level1','maxScore':13,'map':[
        {'row':13,'col':13,'type':'black'},
        {'row':13,'col':15,'type':'black'},
    ]},
    {'level':2,'name':'level2','maxScore':'10(?)','map':[
        {'row':13,'col':13,'type':'black'},
        {'row':13,'col':14,'type':'black'},
    ]},

    {'level':3,'name':'level3','maxScore':'unknown','map':[
        {'row':13,'col':13,'type':'black'},
        {'row':13,'col':15,'type':'black'},
        {'row':15,'col':14,'type':'black'},
    ]},

    {'level':4,'name':'level4','maxScore':'unknown','map':[
        {'row':13,'col':15,'type':'black'},
        {'row':15,'col':14,'type':'black'},
        {'row':15,'col':15,'type':'black'},
        {'row':15,'col':16,'type':'black'},
    ]},

    {'level':5,'name':'random','maxScore':'unknown','map':[
        {'row':13,'col':13,'type':'black'},
        {'row':13,'col':14,'type':'black'},
    ]},

]

//hexGrid[9][10].g.classList.add('selected');
//hexGrid[9][10].g.classList.add('type-black');

const navBar = document.getElementById('nav-bar');

const navBarDiv = document.createElement('div');
navBar.appendChild(navBarDiv);

const logo = document.createElement('div');
logo.classList.add('logo-text');
logo.innerText = 'SAMA-GO';
navBarDiv.appendChild(logo);

const ul=document.createElement('ul');
levels.forEach(function(level){
    const li = document.createElement('li');
    li.innerHTML = `<button class="bg-transparent w-32 hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border-2 border-teal-500 hover:border-transparent rounded" style="font-size:20px" onClick="window.setLevel(${level.level})">${level.name.toUpperCase()}</button>`;
    ul.appendChild(li);
});
navBarDiv.appendChild(ul);

function setLevel(level) {
    levels[level]['map'].forEach(function(hex) {
        hexGrid[hex.row][hex.col].g.classList.add('selected');
        hexGrid[hex.row][hex.col].g.classList.add('type-'+hex.type);
    });
    gameturn = 0;
    score=levels[level].map.length;
    maxScore=levels[level].maxScore
    scoreBoard.textContent = `SAMA-GO score = ${score} (max:${maxScore})`;
    lastone=null;
    navBar.style.display='none';
}
window.setLevel=setLevel;

const scoreBoard = document.getElementById('score-board');

const playBoard = document.getElementById('svg-board');
const rowShift = [100,86.6];
const colShift = [200,0];

const numRows = 64;
const numCols = 64;

// hex rows container
const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
container.setAttribute('class', 'hex-container');

let container_x = -500;
let container_y = -500;
let container_scale =-1.;
container.setAttribute('transform', `translate(${container_x},${container_y}) scale(${Math.exp(container_scale)})`);
//make container draggable and scalable
let x0, y0;
playBoard.addEventListener('mousedown', function(e) {
    //const x = e.clientX - this.getBoundingClientRect().left;
    //const y = e.clientY - this.getBoundingClientRect().top;
    x0 = e.clientX;
    y0 = e.clientY;
    this.addEventListener('mousemove', drag);
});
playBoard.addEventListener('mouseup', function(e) {
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    container_x += dx;
    container_y += dy;
    container.setAttribute('transform', `translate(${container_x},${container_y}) scale(${Math.exp(container_scale)})`);
    this.removeEventListener('mousemove', drag);
});
function drag(e) {
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    container.setAttribute('transform', `translate(${container_x + dx},${container_y + dy}) scale(${Math.exp(container_scale)})`);
}
playBoard.addEventListener('wheel', function(e) {
    const delta = e.deltaY;
    container_scale += delta/1000;
    container_scale = Math.min(Math.max(container_scale, -2) , 0);
    container.setAttribute('transform', `translate(${container_x},${container_y}) scale(${Math.exp(container_scale)})`);
});

playBoard.appendChild(container);

// hex grid
const hexGrid = [];
for (let row = 0; row < numRows; row++) {
    hexGrid.push([]);
    for (let col = 0; col < numCols; col++) {
        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        hex.setAttribute('id', `hex-${row}-${col}`);
        hex.setAttribute('transform', `translate(${(row%2) * 86.6 + col * 86.6 * 2 } ${row * 150 + col * 0})`);
        container.appendChild(hex);
        
        const hexPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hexPath.setAttribute('class', 'hex-path');
        hexPath.setAttribute('d', 'M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z');
        hex.appendChild(hexPath);

        const hexText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        hexText.setAttribute('class', 'hex-text');
        hexText.setAttribute('x', '86.6');
        hexText.setAttribute('y', '100');
        //hexText.setAttribute('dy', '0.35em');
        hexText.setAttribute('text-anchor', 'middle');
        hexText.setAttribute('alignment-baseline', 'middle');
        hexText.setAttribute('font-size', '1.5em');
        hexText.setAttribute('font-family', 'sans-serif');
        hexText.setAttribute('fill', '#f82');
        //hexText.textContent = `${row}-${col}`;
        hex.appendChild(hexText);

        hexGrid[row].push({'g':hex, 'path':hexPath, 'text':hexText});
        
    }
}

window.hexGrid = hexGrid;


// game functions
let gameturn = 0;
let lastone = null;

function selectHex(row, col) {
    const hex = hexGrid[row][col];
    const type = (gameturn % 4) == 0 ? 'black' : 'blue';
    if (hex.g.classList.contains('selected')) {
        if(hex.g.classList.contains('turn-' + (gameturn-1))) {
            gameturn--;
            hex.g.classList.remove('selected');
            hex.g.classList.remove('type-' + ((gameturn % 4) == 0 ? 'black' : 'blue'));
            hex.g.classList.remove('turn-' + gameturn);
            console.log(`# ${gameturn}:${type} - (${row},${col}) is unselected`);
        }
        else{
            console.log(`# ${gameturn}:${type} - (${row},${col}) cannot be unselected`);
        }
    } else {

        if(type=='black'){
            //check the neighbor hexes to see if there are odd numbers of type-black
            const neighbors = getNeighbors(row, col);
            let type0_count = 0;
            neighbors.forEach(function(neighbor) {
                if(neighbor.g.classList.contains('type-black')) {
                    type0_count++;
                }
            })
            
            console.log(type0_count);
            if(type0_count%2==0){
                console.log(`# ${gameturn}:${type} - (${row},${col}) cannot be selected because there are no odd number of type-black neighbors`);
                return;
            }

        }
        if(type=='blue'){
            //check the neighbor hexes to see if there are type-black
            const neighbors = getNeighbors(row, col);
            let flag=false;
            for(let i=0; i<neighbors.length; i++){
                if(neighbors[i].g.classList.contains('type-black')){
                    flag=true;
                    break;
                }
            }
            if(!flag){
                console.log(`# ${gameturn}:${type} - (${row},${col}) cannot be selected because there is no type-black neighbor`);
                return;
            }
        }

        hex.g.classList.add('selected');
        hex.g.classList.add('type-' + type);
        hex.g.classList.add('turn-' + gameturn);
        gameturn++;
        console.log(`# ${gameturn}:${type} - (${row},${col}) is selected`);
        if(type=='black'){
            score++;
            scoreBoard.textContent = `SAMA-GO score = ${score} (max:${maxScore})`;
        }
        if(lastone){
            lastone.g.classList.remove('lastone');
        }
        lastone = hex;
        lastone.g.classList.add('lastone');
    }
}
window.selectHex=selectHex;

let score=0;
let maxScore=0;

// get nearest neighbors
function getNeighbors(row, col) {
    const lucol = col + row%2;
    const neighbors = [[row-1,lucol-1],[row-1,lucol],[row,col-1],[row,col+1],[row+1,lucol-1],[row+1,lucol]];
    return neighbors.filter(function(neighbor) {
        return neighbor[0] >= 0 && neighbor[0] < numRows && neighbor[1] >= 0 && neighbor[1] < numCols;
    }).map((neighbor) => {
        return hexGrid[neighbor[0]][neighbor[1]];
    });
}

//click event
playBoard.addEventListener('click', function(e) {
    //select hover hex by class hover
    const hex = e.target.closest('g');
    if(hex){
        const row = parseInt(hex.id.split('-')[1]);
        const col = parseInt(hex.id.split('-')[2]);
        selectHex(row, col);
    }
});