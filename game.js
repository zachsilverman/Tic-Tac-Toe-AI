const wins = [
  [0, 1, 2],  // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // \ diagonal
  [2, 4, 6] // / diagonal
]

const aiPlayer = 'x';
const humanPlayer = 'o';
// let depthCounter = 0;
const cellElements = document.querySelectorAll('[data-cell]');
const boardTurn = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
for(cell of cellElements){
    cell.addEventListener('click',handleClick,{once:true}) 
}

function handleClick(e){
    const cell = e.target;
    const currentClass = turn(depth());
    placeMark(cell,currentClass);
    let theWinner = winner(currentClass)
    if(theWinner === 'x'){
        endGame(theWinner);
    }else if(theWinner === 'o'){
        endGame(theWinner);
    }
    console.log(depth());
}

function placeMark(cell,currentClass){
    boardTurn.classList.remove('o');
    boardTurn.classList.remove('x');
    if(currentClass === 'x') // if we are currently a x then we have to switch to o for the next turn
        boardTurn.classList.add('o');
    else if(currentClass === 'o')
        boardTurn.classList.add('x');
    cell.classList.add(currentClass);
}

function turn(num){
    if(num >= 9){
        return '-';
    } else if (num % 2 === 0){
        return 'x';
    } 
    return 'o';
}

function depth(){
    let count = 0;
    for(let i = 0; i < 9; i++){
        if(cellElements[i].classList.contains('x') 
        || cellElements[i].classList.contains('o')){
            count++;
        }
    }
    return count;
}


function winner(currentClass){
    let count = 0;
    for(let i = 0; i < wins.length; i++){
        if( cellElements[wins[i][0]].classList.contains('x') && 
            cellElements[wins[i][1]].classList.contains('x') &&
            cellElements[wins[i][2]].classList.contains('x')){
            return 'x';
        }else if(cellElements[wins[i][0]].classList.contains('o') && 
            cellElements[wins[i][1]].classList.contains('o') &&
            cellElements[wins[i][2]].classList.contains('o')){
            return 'o';
        }
    }
    if(depth() == 9)
        return '-'; 
    return '?';
}

function endGame(winner){
    winningMessageElement.innerText = $'X Wins!';
    if (winner === 'x'){
        
         winningMessageElement.classList.add('show');
         console.log(winningMessageElement);
    }else if(winner === 'o'){
          winningMessageElement.innerText = ('O Wins!');
         winningMessageElement.classList.add('show');
    }else if(winner === '-'){
        // winningMessageElement.innerText = ('Its a Tie!');
    }
} 