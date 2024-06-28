 
        document.addEventListener('DOMContentLoaded', () => {
    const intervalSelect = document.getElementById('interval-select');
    const callNumberButton = document.getElementById('call-number-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const checkWinnerButton = document.getElementById('check-winner-button');
    const countdownElement = document.getElementById('countdown');
    const calledNumberElement = document.getElementById('called-number');
    const calledNumbersContainer = document.getElementById('called-numbers-container');
    const resultElement = document.getElementById('result');
    const totalBetAmountElement = document.getElementById('total-bet-amount');
    const rows = {
        B: document.getElementById('row-B'),
        I: document.getElementById('row-I'),
        N: document.getElementById('row-N'), 
        G: document.getElementById('row-G'),
        O: document.getElementById('row-O')
    };

    const numbers = {
        B: Array.from({ length: 15 }, (_, i) => i + 1),
        I: Array.from({ length: 15 }, (_, i) => i + 16),
        N: Array.from({ length: 15 }, (_, i) => i + 31),
        G: Array.from({ length: 15 }, (_, i) => i + 46),
        O: Array.from({ length: 15 }, (_, i) => i + 61),
    };

    const calledNumbers = new Set();
    let intervalId = null;
    let paused = false;

    function initializeBoard() {
        for (const [letter, nums] of Object.entries(numbers)) {
            for (const num of nums) {
                const div = document.createElement('div');
                div.classList.add('number');
                div.textContent = num;
                div.dataset.number = `${letter}${num}`;
                rows[letter].appendChild(div);
            }
        }
    }

    function getRandomNumber() {
        const availableNumbers = [];
        for (const [letter, nums] of Object.entries(numbers)) {
            for (const num of nums) {
                const number = `${letter}${num}`;
                if (!calledNumbers.has(number)) {
                    availableNumbers.push(number);
                }
            }
        }
        if (availableNumbers.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        return availableNumbers[randomIndex];
    }

    function callNumber() {
        const number = getRandomNumber();
        if (!number) return;
        calledNumbers.add(number);

        // Save the called numbers to localStorage
        localStorage.setItem('called_numbers', JSON.stringify(Array.from(calledNumbers)));

        const [letter, num] = [number[0], parseInt(number.slice(1))];
        const numberElement = [...rows[letter].children].find(
            (div) => parseInt(div.textContent) === num
        );
        numberElement.classList.add('called');

        calledNumberElement.textContent = number;
        const calledNumberItem = document.createElement('div');
        calledNumberItem.classList.add('called-number-item');
        calledNumberItem.textContent = number;
        calledNumbersContainer.appendChild(calledNumberItem);
    }

    function startCallingNumbers() {
        const interval = parseInt(intervalSelect.value) * 1000;
        callNumber();
        intervalId = setInterval(() => {
            if (!paused) callNumber();
        }, interval);
    }

    function stopCallingNumbers() {
        clearInterval(intervalId);
    }

    function checkWinner() {
        const boardNumber = parseInt(document.getElementById('board-number-input').value);
        if (isNaN(boardNumber) || boardNumber < 1) {
            resultElement.textContent = 'Please enter a valid board number.';
            return;
        }

        const boards = JSON.parse(localStorage.getItem('bingo_boards'));
        const selectedIndices = JSON.parse(localStorage.getItem('selected_boards'));

        if (!boards || boardNumber > boards.length) {
            resultElement.textContent = 'Board number not found.';
            return;
        }

        if (!selectedIndices.includes(boardNumber - 1)) {
            resultElement.textContent = `Board number ${boardNumber} is not registered.`;
            return;
        }

        const board = boards[boardNumber - 1];
        if (checkBoard(board)) {
            resultElement.textContent = `We have a winner! Board number ${boardNumber}`;
        } else {
            resultElement.textContent = `Board number ${boardNumber} has not won yet.`;
        }
    }

    function checkBoard(board) {
        const winningPatterns = [
            // Horizontal patterns
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
            [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
            [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
            [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]],
            [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]],
            // Vertical patterns
            [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
            [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
            [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
            [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3]],
            [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]],
            // Diagonal patterns
            [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]],
            // Corners and free spot patterns
            [[0, 0], [0, 4], [2, 2], [4, 0], [4, 4]],
            // Full board pattern
            [...Array(5).keys()].flatMap(i => [...Array(5).keys()].map(j => [i, j]))
        ];

        for (const pattern of winningPatterns) {
            if (pattern.every(([r, c]) => board[r][c] === 'FREE' || board[r][c] === 'CALLED')) {
                return true;
            }
        }
        return false;
    }

    function displayTotalBetAmount() {
        const selectedIndices = JSON.parse(localStorage.getItem('selected_boards'));
        const betAmount = localStorage.getItem('bet_amount');
        if (selectedIndices && selectedIndices.length > 0 && betAmount) {
            const totalBetAmount = selectedIndices.length * parseFloat(betAmount);
            totalBetAmountElement.textContent = `Total Bet Amount: $${totalBetAmount.toFixed(2)}`;
        } else {
            totalBetAmountElement.textContent = 'Total Bet Amount: $0';
        }
    }

    callNumberButton.addEventListener('click', startCallingNumbers);
    playPauseButton.addEventListener('click', () => {
        paused = !paused;
        playPauseButton.textContent = paused ? 'Resume' : 'Pause';
    });
    checkWinnerButton.addEventListener('click', checkWinner);

    initializeBoard();
    displayTotalBetAmount();
});


