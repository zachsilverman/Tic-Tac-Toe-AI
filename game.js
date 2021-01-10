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

//array of 3^9 (all combinations of Tic-Tac-Toe Gammes 19683 games)
let hashTable = []
const hsize = 19683
const cellElements = document.querySelectorAll('[data-cell]');
const boardTurn = document.getElementById('board');
const startScreen = document.querySelector('[start]');
const startText = document.querySelector('[startText]')
const xButton = document.getElementById('x')
const oButton = document.getElementById('o')
let aiPlayer = '';
let humanPlayer = '';
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

let depthCounter = 0;
let firstBoard = '012345678';
let buttons = [xButton,oButton];

for(let button of buttons){
        button.addEventListener('click',buttonClick,{once:true});
}


function buttonClick(e){
    const button = e.target;
    if(button.id === 'x'){
        humanPlayer = 'x'
        aiPlayer = 'o'
        startScreen.classList.add('settled')
        boardTurn.classList.add('settled')
        boardTurn.classList.add('x')
    }else if(button.id === 'o'){
        humanPlayer = 'o'
        aiPlayer = 'x'
        startScreen.classList.add('settled')
        boardTurn.classList.add('settled');
        boardTurn.classList.add('o')
    }
    if(startScreen.classList.contains('settled')){
        startScreen.classList.add('ready');
        if(aiPlayer === 'x'){
            let currentBoard = createBoard();
            let future = best_move(boardHash(currentBoard));
            let newMove = (turn(currentBoard) === 'x') ? 'x' : 'o'
            cellElements[future].classList.add(newMove);
            currentBoard = currentBoard.replace(future,'x')
           
            let theWinner = winner(currentBoard);
            if(theWinner === 'x'){
                endGame(theWinner);
            }else if(theWinner === 'o'){
                endGame(theWinner);
            }else if(theWinner === '-'){
                endGame(theWinner);
            } 
        }
    }
}


init_boards();
init_board(firstBoard);
join_graph(firstBoard);
compute_score();

function startGame(){
    startText.innerText = 'Welcome to Tick Tac Toe! \n X or O?';
}

startGame()
console.log('hi')

for(cell of cellElements){
    cell.addEventListener('click',handleClick,{once:true}) 
}

function handleClick(e){
    const cell = e.target;
    if(startScreen.classList.contains('ready') && isAvailable(cell)){
        placeMark(cell,humanPlayer);   
            let currentBoard = createBoard();
        console.log(currentBoard)
        let future = best_move(boardHash(currentBoard));
        let newMove = (turn(currentBoard) === 'x') ? 'x' : 'o'
        cellElements[future].classList.add(newMove);
        currentBoard = currentBoard.replace(future,aiPlayer)
        let theWinner = winner(currentBoard);
        if(theWinner === 'x'){
            endGame(theWinner);
        }else if(theWinner === 'o'){
            endGame(theWinner);
        }else if(theWinner === '-'){
            endGame(theWinner);
        }  
    }
}

function isAvailable(cell){
    return !(cell.classList.contains('x') || cell.classList.contains('o'))
}




function placeMark(cell,currentClass){
    boardTurn.classList.remove('o');
    boardTurn.classList.remove('x');
    if(currentClass === 'x' ) // if we are currently a x then we have to switch to o for the next turn
        boardTurn.classList.add('x');
    else if(currentClass === 'o')
        boardTurn.classList.add('o');
    cell.classList.add(currentClass);
}


function turn(board){
    if(depthOfBoardStr(board) === 9) {
        return '-'
    }
    if(winner(board) === 'x' || winner(board) === 'o'){
        return '-'
    }
    if(depthOfBoardStr(board) % 2 === 0){
        return 'x'
    }
    else{
        return 'o'
    }
}

function depthOfBoardStr(board){
    let count = 0
    for(let c of board){
        if(c === 'x' || c === 'o'){
            count++
        }
    }
    return count
}

function createBoard(){
    
    let board = '012345678';
    for(let i = 0; i < 9; i++){
        if(cellElements[i].classList.contains('x')){
            board = board.replace(i.toString(),'x')
        }
        if(cellElements[i].classList.contains('o')){
            board = board.replace(i.toString(),'o')
        }
    }
    return board;
}

function winner(board){
    let count = 0;
    for(let i = 0; i < 8;i++){
        if( board[wins[i][0]] === 'x' && board[wins[i][1]] === 'x'
            && board[wins[i][2]] === 'x'){
            return 'x';
        }else if( board[wins[i][0]] === 'o' && board[wins[i][1]] === 'o'
            && board[wins[i][2]] === 'o'){
            return 'o';
        }
    }
    if(depthOfBoardStr(board) == 9)
        return '-'; 
    return '?';
}

function endGame(winner){
    if (winner === 'x'){ 
        winningMessageTextElement.innerText = 'X Wins!';
        winningMessageElement.classList.add('show');
    }else if(winner === 'o'){
        winningMessageTextElement.innerText = 'O Wins!';
        winningMessageElement.classList.add('show');
    }else if(winner === '-'){
        winningMessageTextElement.innerText = 'Its a Tie!';
        winningMessageElement.classList.add('show');
    }
} 

function boardHash(board){
    let total = 0;
    let mult = 1;
    for(let i = 0; i < 9; i++){
        switch(board[i]){
            case 'x':
                total += 2 * mult
            break
            case 'o':
                total += 1 * mult
            break
            default:
                total += 0 * mult
            break
        }
        mult*=3
    }
    return total;
}


function init_boards(){
    for(let i = 0; i < hsize; i++){
        let obj =  {
            'init': 0,
            'turn': '',
            'depth': 0,
            'board': "",
            'winner': "",
            'move': [],
            'score':0
        }
        hashTable.push(obj);
    }
}

function init_board(board){
    let board_hash = boardHash(board)
    hashTable[board_hash].init = 1
    hashTable[board_hash].turn = turn(board)
    hashTable[board_hash].depth = depthOfBoardStr(board)
    hashTable[board_hash].board = board
    hashTable[board_hash].winner = winner(board)
}

function join_graph(board){
  let hashIndex = boardHash(board);
  let tempBoard; 
  let turnVal;
    if (winner(board) === 'x' || winner(board) === 'o' || winner(board) === '-' ){
        for (let i = 0; i < 9; i++){
            hashTable[hashIndex].move[i] = -1;
        }
        return;
    }   

    for (let i = 0; i < 9; i++){
        if (board[i] === 'x' || board[i] === 'o'){
            hashTable[hashIndex].move[i] = -1;
        }
        
        else if (board[i] >= '0' && board[i] <= '8'){
            tempBoard = board
            turnVal = turn(board);
            tempBoard = board.replace(i.toString(),turnVal)
            hashTable[hashIndex].move[i] = boardHash(tempBoard);
            if (hashTable[boardHash(tempBoard)].init == 0){
                init_board(tempBoard);
                join_graph(tempBoard);
            }
        }
    }
}


function print_node(board_node){
   console.log( "init=%d\n", board_node.init );
  if (board_node.init){
    console.log('turn=',board_node.turn );
    console.log("depth=", board_node.depth );
    console.log('board',board_node.board );
    console.log( "winner=", board_node.winner );
    console.log('moves',board_node.move);
    console.log( "score=", board_node.score );
  }
}


function compute_score(){
    let childNode = 0;
    for (let depthCount = 9; depthCount >= 0; depthCount--){
        for (let i = 0; i < hsize; i++){
            if (hashTable[i].init == 1 && hashTable[i].depth == depthCount){
                if (hashTable[i].winner == 'x'){
                    hashTable[i].score = 1;
                }
                else if (hashTable[i].winner == 'o'){
                    hashTable[i].score = -1;
                }
                else if (hashTable[i].winner == '-'){
                    hashTable[i].score = 0;
                }
                else if (hashTable[i].turn == 'x'){
                    let max = -100000;
                    for (let j = 0; j < 9; j++){
                        childNode = hashTable[i].move[j];
                        if (childNode != -1) {
                            if (hashTable[childNode].score > max){
                                max = hashTable[childNode].score;
                            }
                        }
                    }
                    hashTable[i].score = max;
                }
                else  if (hashTable[i].turn == 'o'){
                    let min = 100000;
                    for (let j = 0; j < 9; j++){
                        childNode = hashTable[i].move[j];
                        if(childNode != -1){
                            if (min > hashTable[childNode].score){
                                min = hashTable[childNode].score;
                            }
                        }
                    }
                    hashTable[i].score = min;
                }
            }
        }
    }
}


function best_move(boardIndex){
    let childNode = 0;
    let min = 1000000;
    let max = -1000000;
    let index = 0;     
    for (let j = 0; j < 9; j++){
        childNode = hashTable[boardIndex].move[j];
        if (childNode != -1){
            if (hashTable[boardIndex].turn == 'x' && hashTable[childNode].score > max){
                max = hashTable[childNode].score;
                index = j;
            }
            if (hashTable[boardIndex].turn == 'o' && min > hashTable[childNode].score){
                min = hashTable[childNode].score;
                index = j;
            }
        }  
    }
    return index;
}