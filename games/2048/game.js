const board = [];
let score = 0;
let gameOver = false;

const gridElements = document.querySelectorAll('.grid');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

function initBoard() {
    for (let i = 0; i < 16; i++) {
        board[i] = 0;
    }
    generateTile();
    generateTile();
    updateBoard();
    gameOver = false;
    gameOverElement.style.display = "none";
}

function updateBoard() {
    board.forEach((value, index) => {
        const grid = gridElements[index];
        if (value !== 0) {
            grid.textContent = value;
            grid.style.backgroundColor = getTileColor(value);
            grid.classList.add('move'); 
            grid.style.transform = 'scale(1.1)'; 
        } else {
            grid.textContent = '';
            grid.style.backgroundColor = '#ccc0b3';
            grid.classList.remove('move');
            grid.style.transform = 'scale(1)'; 
        }
    });
    scoreElement.textContent = score;
}

function generateTile() {
    const emptyIndexes = [];
    board.forEach((value, index) => {
        if (value === 0) {
            emptyIndexes.push(index);
        }
    });
    if (emptyIndexes.length === 0) return;

    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;
    board[randomIndex] = newValue;

    const grid = gridElements[randomIndex];
    grid.style.opacity = 0;
    grid.style.transform = 'scale(0)';
    setTimeout(() => {
        grid.style.opacity = 1;
        grid.style.transform = 'scale(1)';
    }, 100); 
}

function getTileColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#ccc0b3';
    }
}

function mergeRow(row) {
    row = row.filter(num => num !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row.splice(i + 1, 1);
        }
    }
    while (row.length < 4) {
        row.push(0);
    }
    return row;
}

function slideTiles(direction) {
    let moved = false;

    if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            let row = board.slice(i * 4, (i + 1) * 4);
            row = mergeRow(row);
            for (let j = 0; j < 4; j++) {
                if (board[i * 4 + j] !== row[j]) moved = true;
                board[i * 4 + j] = row[j];
            }
        }
    } else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = board.slice(i * 4, (i + 1) * 4).reverse();
            row = mergeRow(row);
            row.reverse();  
            for (let j = 0; j < 4; j++) {
                if (board[i * 4 + j] !== row[j]) moved = true;
                board[i * 4 + j] = row[j];
            }
        }
    } else if (direction === 'up') {
        for (let i = 0; i < 4; i++) {
            let column = [];
            for (let j = 0; j < 4; j++) {
                column.push(board[j * 4 + i]);
            }
            column = mergeRow(column);
            for (let j = 0; j < 4; j++) {
                if (board[j * 4 + i] !== column[j]) moved = true;
                board[j * 4 + i] = column[j];
            }
        }
    } else if (direction === 'down') {
        for (let i = 0; i < 4; i++) {
            let column = [];
            for (let j = 0; j < 4; j++) {
                column.push(board[j * 4 + i]);
            }
            column = column.reverse();
            column = mergeRow(column);
            column.reverse();
            for (let j = 0; j < 4; j++) {
                if (board[j * 4 + i] !== column[j]) moved = true;
                board[j * 4 + i] = column[j];
            }
        }
    }

    if (moved) {
        generateTile();
        updateBoard();
        checkGameOver();
    }
}

document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    if (event.key === 'ArrowLeft') {
        slideTiles('left');
    } else if (event.key === 'ArrowRight') {
        slideTiles('right');
    } else if (event.key === 'ArrowUp') {
        slideTiles('up');
    } else if (event.key === 'ArrowDown') {
        slideTiles('down');
    }
});


let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) slideTiles('right');
        else if (dx < -30) slideTiles('left');
    } else {
        if (dy > 30) slideTiles('down');
        else if (dy < -30) slideTiles('up');
    }
});

function checkGameOver() {
    const emptyTiles = board.filter(value => value === 0).length;
    if (emptyTiles === 0) {
        gameOver = true;
        gameOverElement.style.display = "block";
        finalScoreElement.textContent = score;
    }
}

function restartGame() {
    score = 0;
    gameOver = false;
    board.fill(0);
    gameOverElement.style.display = "none";
    initBoard();
}

initBoard();