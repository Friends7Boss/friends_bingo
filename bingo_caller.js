document.addEventListener('DOMContentLoaded', () => {
    const intervalSelect = document.getElementById('interval-select');
    const callNumberButton = document.getElementById('call-number-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const endGameButton = document.getElementById('end-game-button');
    const checkWinnerButton = document.getElementById('check-winner-button');
    const calledNumberElement = document.getElementById('called-number');
    const calledNumbersContainer = document.getElementById('called-numbers-container');
    const totalBetAmountElement = document.getElementById('total-bet-amount');
    const totalCallsElement = document.getElementById('total-calls');
    const countdownElement = document.getElementById('countdown');
    const winnerModalBody = document.getElementById('winner-modal-body');
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
    let totalCalls = 0;
    let countdownValue = 0;

    const ballColors = {
        B: 'red',
        I: 'orange',
        N: 'yellow',
        G: 'green',
        O: 'blue'
    };

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
        highlightNumbersRandomly(); // Call the highlightNumbersRandomly function after initializing the board
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
        totalCalls += 1;

        // Save the called numbers to localStorage
        localStorage.setItem('called_numbers', JSON.stringify(Array.from(calledNumbers)));

        const [letter, num] = [number[0], parseInt(number.slice(1))];
        const numberElement = [...rows[letter].children].find(
            (div) => parseInt(div.textContent) === num
        );
        numberElement.classList.add('called');

        calledNumberElement.innerHTML = `<div class="ball ${letter.toLowerCase()}" style="background-color: ${ballColors[letter]}"><span>${letter}</span><span>${num}</span></div>`;
        const calledNumberItem = document.createElement('div');
        calledNumberItem.classList.add('called-number-item', letter.toLowerCase());
        calledNumberItem.innerHTML = `<span>${letter}</span><span>${num}</span>`;

        // Show only the 4 most recently called numbers
        if (calledNumbersContainer.children.length >= 4) {
            calledNumbersContainer.removeChild(calledNumbersContainer.firstChild);
        }
        calledNumbersContainer.appendChild(calledNumberItem);

        totalCallsElement.textContent = `Total Calls: ${totalCalls}`;
        startCountdown();
        playRecordedAudio(letter, num);  // Play the recorded audio for the called letter and number
    }

    function startCountdown() {
        countdownValue = parseInt(intervalSelect.value);
        countdownElement.textContent = countdownValue;

        const countdownInterval = setInterval(() => {
            if (countdownValue > 1) {
                countdownValue -= 1;
                countdownElement.textContent = countdownValue;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function endGame() {
        // Record the bet amount at the end of the game
        recordBetAmount();

        // Clear localStorage
        localStorage.removeItem('called_numbers');
        localStorage.removeItem('bingo_boards');
        localStorage.removeItem('selected_boards');
        localStorage.removeItem('bet_amount');

        // Reset the game state
        calledNumbers.clear();
        calledNumberElement.textContent = '';
        calledNumbersContainer.innerHTML = '';
        totalCalls = 0;
        totalCallsElement.textContent = `Total Calls: ${totalCalls}`;
        countdownElement.textContent = '';

        // Reset board UI
        Object.keys(rows).forEach(letter => {
            while (rows[letter].firstChild) {
                rows[letter].removeChild(rows[letter].firstChild);
            }
        });

        // Reinitialize the board
        initializeBoard();

        // Redirect to select_board.html
        window.location.href = 'index.html';
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
            showModal('Please enter a valid board number.');
            return;
        }

        const boards = JSON.parse(localStorage.getItem('bingo_boards'));
        const selectedIndices = JSON.parse(localStorage.getItem('selected_boards'));
        const calledNumbersSet = new Set(JSON.parse(localStorage.getItem('called_numbers')));

        if (!boards || boardNumber > boards.length) {
            showModal('Board number not found.');
            return;
        }

        if (!selectedIndices.includes(boardNumber - 1)) {
            showModal(`Board number ${boardNumber} is not registered.`);
            return;
        }

        const board = boards[boardNumber - 1];
        const hasWon = checkBoard(board);
        showModal(`Board number ${boardNumber} ${hasWon ? 'has won!' : 'has not won yet.'}`, board, calledNumbersSet);
        playPopupSound(hasWon);
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
            // Adjacent to free cell diagonal patterns
            [[1, 1], [2, 2], [3, 3], [1, 3], [3, 1]],
            // Corners and free spot patterns
            [[0, 0], [0, 4], [2, 2], [4, 0], [4, 4]],
            // Full board pattern
            [...Array(5).keys()].flatMap(i => [...Array(5).keys()].map(j => [i, j]))
        ];

        for (const pattern of winningPatterns) {
            if (pattern.every(([r, c]) => calledNumbers.has(`${'BINGO'[c]}${board[r][c]}`) || board[r][c] === 'FREE')) {
                return true;
            }
        }
        return false;
    }

    function showModal(message, board = null, calledNumbersSet = null) {
        winnerModalBody.innerHTML = `<p>${message}</p>`;
        if (board) {
            const boardElement = renderBingoBoard(board, calledNumbersSet);
            winnerModalBody.appendChild(boardElement);
        }
        $('#winnerModal').modal('show');
    }

    function renderBingoBoard(board, calledNumbersSet) {
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('bingo-board', 'shadow-sm', 'rounded', 'mb-4');

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
                const cellValue = board[i][j];

                if (cellValue === 'FREE') {
                    cellElement.classList.add('free');
                } else {
                    const cellId = `${headers[j]}${cellValue}`;
                    if (calledNumbersSet.has(cellId)) {
                        cellElement.classList.add('called-cell'); // Use the appropriate class to mark called numbers
                    }
                }
                boardContainer.appendChild(cellElement);
            }
        }

        return boardContainer;
    }

    function recordBetAmount() {
        const selectedIndices = JSON.parse(localStorage.getItem('selected_boards'));
        const betAmount = localStorage.getItem('bet_amount');
        const currentDate = new Date().toLocaleString();

        if (selectedIndices && selectedIndices.length > 0 && betAmount) {
            const totalBetAmount = selectedIndices.length * parseFloat(betAmount);
            const profit = totalBetAmount * 0.2; // Calculate 20% profit

            let betHistory = JSON.parse(localStorage.getItem('bet_history')) || [];
            betHistory.push({ amount: profit.toFixed(2), date: currentDate });
            localStorage.setItem('bet_history', JSON.stringify(betHistory));
        }
    }

    function displayTotalBetAmount() {
        const selectedIndices = JSON.parse(localStorage.getItem('selected_boards'));
        const betAmount = localStorage.getItem('bet_amount');
        if (selectedIndices && selectedIndices.length > 0 && betAmount) {
            const totalBetAmount = selectedIndices.length * parseFloat(betAmount);
            const reducedBetAmount = totalBetAmount * 0.8; // Calculate 20% less
            totalBetAmountElement.textContent = `ደራሽ: ${reducedBetAmount.toFixed(2)}`;
        } else {
            totalBetAmountElement.textContent = 'ደራሽ: 0';
        }
    }

    function playPopupSound(isClear) {
        const clearSound = document.getElementById('clear-result-sound');
        const unclearSound = document.getElementById('unclear-result-sound');
        console.log('Playing sound:', isClear ? 'clear' : 'unclear');
        if (isClear) {
            clearSound.play().catch(e => console.log('Failed to play clear sound:', e));
        } else {
            unclearSound.play().catch(e => console.log('Failed to play unclear sound:', e));
        }
    }

    function highlightNumbersRandomly() {
        const numberElements = document.querySelectorAll('.number');
        const highlightedIndices = new Set();

        function highlightNextNumber() {
            if (highlightedIndices.size < numberElements.length) {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * numberElements.length);
                } while (highlightedIndices.has(randomIndex));

                highlightedIndices.add(randomIndex);
                numberElements[randomIndex].classList.add('blink'); // Apply blink class
                setTimeout(() => {
                    numberElements[randomIndex].classList.remove('blink'); // Remove blink class after blinking
                    highlightNextNumber();
                }, 200); // Blink duration
            }
        }

        highlightNextNumber();
    }

    callNumberButton.addEventListener('click', startCallingNumbers);
    playPauseButton.addEventListener('click', () => {
        paused = !paused;
        playPauseButton.textContent = paused ? 'Resume' : 'Pause';
    });
    endGameButton.addEventListener('click', endGame);
    checkWinnerButton.addEventListener('click', checkWinner);

    initializeBoard();
    displayTotalBetAmount();
});
