// bingo.js

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateBingoBoard() {
    const board = [];

    // Define number ranges for each column
    const ranges = [
        Array.from({ length: 15 }, (_, i) => i + 1),  // B column: 1-15
        Array.from({ length: 15 }, (_, i) => i + 16), // I column: 16-30
        Array.from({ length: 15 }, (_, i) => i + 31), // N column: 31-45
        Array.from({ length: 15 }, (_, i) => i + 46), // G column: 46-60
        Array.from({ length: 15 }, (_, i) => i + 61)  // O column: 61-75
    ];

    // Shuffle each range
    ranges.forEach(range => shuffle(range));

    // Create the board using the shuffled numbers
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            if (i === 2 && j === 2) {
                row.push('FREE');
            } else {
                row.push(ranges[j][i]);
            }
        }
        board.push(row);
    }

    return board;
}

function renderBingoBoard(board, index) {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('bingo-board', 'shadow-sm', 'rounded', 'mb-4');

    const title = document.createElement('div');
    title.classList.add('board-title');
    title.textContent = `Board ${index + 1}`;
    boardContainer.appendChild(title);

    const headers = ['B', 'I', 'N', 'G', 'O'];
    const headerClasses = ['header-b', 'header-i', 'header-n', 'header-g', 'header-o'];
    headers.forEach((header, index) => {
        const headerCell = document.createElement('div');
        headerCell.textContent = header;
        headerCell.classList.add('header', headerClasses[index]);
        boardContainer.appendChild(headerCell);
    });

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cellElement = document.createElement('div');
            cellElement.textContent = board[i][j];
            if (board[i][j] === 'FREE') {
                cellElement.classList.add('free');
            }
            boardContainer.appendChild(cellElement);
        }
    }

    return boardContainer;
}

