// bingo.js

function transposeBoard(board) {
    const transposedBoard = [];
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            row.push(board[j][i]);
        }
        transposedBoard.push(row);
    }
    return transposedBoard;
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
