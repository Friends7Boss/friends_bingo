document.addEventListener('DOMContentLoaded', () => {
    const freeSpot = 13;
    const winningPatterns = {
        diagonal: [1, 7, 13, 19, 25],
        reverseDiagonal: [5, 9, 13, 17, 21],
        diagonalAndReverseAdjacentToFree: [7, 9, 13, 17, 19],
        horizontal: [
            [1, 2, 3, 4, 5, 13],
            [6, 7, 8, 9, 10, 13],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20, 13],
            [21, 22, 23, 24, 25, 13]
        ],
        vertical: [
            [1, 6, 11, 16, 21, 13],
            [2, 7, 12, 17, 22, 13],
            [3, 8, 13, 18, 23],
            [4, 9, 14, 19, 24, 13],
            [5, 10, 15, 20, 25, 13]
        ],
        fourCorners: [1, 5, 21, 25, 13],
        cornersAndDiagonalsToFree: [1, 5, 9, 13, 17, 21, 25]
    };

    function highlightCells(cells) {
        cells.forEach(cell => {
            document.getElementById(`cell${cell}`).classList.add('winning-cell');
        });
    }

    function clearHighlights() {
        document.querySelectorAll('.grid-item').forEach(cell => {
            cell.classList.remove('winning-cell');
        });
    }

    function showPattern(pattern) {
        clearHighlights();
        if (Array.isArray(pattern[0])) {
            pattern.forEach(row => highlightCells(row));
        } else {
            highlightCells(pattern);
        }
    }

    // Show patterns sequentially with a delay
    const patterns = [
        winningPatterns.diagonalAndReverseAdjacentToFree,
        winningPatterns.diagonal,
        winningPatterns.reverseDiagonal,
        ...winningPatterns.horizontal,
        ...winningPatterns.vertical,
        winningPatterns.fourCorners,
        winningPatterns.cornersAndDiagonalsToFree
    ];

    let index = 0;
    function displayNextPattern() {
        if (index < patterns.length) {
            showPattern(patterns[index]);
            index++;
            setTimeout(displayNextPattern, 2000); // Change pattern every 2 seconds
        }
    }

    displayNextPattern();
});
