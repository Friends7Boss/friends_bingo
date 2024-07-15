@ -1,109 +1,3 @@
function playRecordedAudio(letter, number) {
    // Base URL for the audio files on your GitHub repository
    const baseURL = 'https://raw.githubusercontent.com/Friendstech7/friends_bingo/main/audio-clips';

    // Construct the URL for the letter audio file
    const audioLetterURL = `${baseURL}/${letter}.mp3`;
    console.log(`Playing letter audio from URL: ${audioLetterURL}`);

    // Construct the URL for the number audio file
    const audioNumberURL = `${baseURL}/${letter}${number}.mp3`;
    console.log(`Playing number audio from URL: ${audioNumberURL}`);

    // Create audio objects
    const audioLetter = new Audio(audioLetterURL);
    const audioNumber = new Audio(audioNumberURL);

    // Play the letter audio first
    audioLetter.play();

    // Once the letter audio finishes, play the number audio
    audioLetter.addEventListener('ended', () => {
        console.log(`Finished playing letter audio. Now playing number audio from URL: ${audioNumberURL}`);
        audioNumber.play();
    });

    // Error handling for audio playback
    audioLetter.addEventListener('error', (e) => {
        console.error(`Error playing letter audio: ${e}`);
    });

    audioNumber.addEventListener('error', (e) => {
        console.error(`Error playing number audio: ${e}`);
    });
}

// Example usage
playRecordedAudio('B', '3');
playRecordedAudio('B', '6');
playRecordedAudio('B', '8');
playRecordedAudio('B', '9');
playRecordedAudio('B', '10');
playRecordedAudio('B', '11');
playRecordedAudio('B', '12');
playRecordedAudio('B', '13');
playRecordedAudio('B', '14');
playRecordedAudio('B', '15');
playRecordedAudio('I', '16');
playRecordedAudio('I', '17');
playRecordedAudio('I', '18');
playRecordedAudio('I', '19');
playRecordedAudio('I', '20');
playRecordedAudio('I', '21');
playRecordedAudio('I', '22');
playRecordedAudio('I', '23');
playRecordedAudio('I', '24');
playRecordedAudio('I', '25');
playRecordedAudio('I', '26');
playRecordedAudio('I', '27');
playRecordedAudio('I', '28');
playRecordedAudio('I', '29');
playRecordedAudio('I', '30');
playRecordedAudio('N', '31');
playRecordedAudio('N', '32');
playRecordedAudio('N', '33');
playRecordedAudio('N', '34');
playRecordedAudio('N', '35');
playRecordedAudio('N', '36');
playRecordedAudio('N', '37');
playRecordedAudio('N', '38');
playRecordedAudio('N', '39');
playRecordedAudio('N', '40');
playRecordedAudio('N', '41');
playRecordedAudio('N', '42');
playRecordedAudio('N', '43');
playRecordedAudio('N', '44');
playRecordedAudio('N', '45');
playRecordedAudio('G', '46');
playRecordedAudio('G', '47');
playRecordedAudio('G', '48');
playRecordedAudio('G', '49');
playRecordedAudio('G', '50');
playRecordedAudio('G', '51');
playRecordedAudio('G', '52');
playRecordedAudio('G', '53');
playRecordedAudio('G', '54');
playRecordedAudio('G', '55');
playRecordedAudio('G', '56');
playRecordedAudio('G', '57');
playRecordedAudio('G', '58');
playRecordedAudio('G', '59');
playRecordedAudio('G', '60');
playRecordedAudio('O', '61');
playRecordedAudio('O', '62');
playRecordedAudio('O', '63');
playRecordedAudio('O', '64');
playRecordedAudio('O', '65');
playRecordedAudio('O', '66');
playRecordedAudio('O', '67');
playRecordedAudio('O', '68');
playRecordedAudio('O', '69');
playRecordedAudio('O', '70');
playRecordedAudio('O', '71');
playRecordedAudio('O', '72');
playRecordedAudio('O', '73');
playRecordedAudio('O', '74');
playRecordedAudio('O', '75');
document.addEventListener('DOMContentLoaded', () => {
    const intervalSelect = document.getElementById('interval-select');
    const callNumberButton = document.getElementById('call-number-button');
@ -113,9 +7,10 @@ document.addEventListener('DOMContentLoaded', () => {
    const calledNumberElement = document.getElementById('called-number');
    const calledNumbersContainer = document.getElementById('called-numbers-container');
    const totalBetAmountElement = document.getElementById('total-bet-amount');
    const countdownElement = document.getElementById('countdown');
    const totalCallsElement = document.getElementById('total-calls');
    const countdownElement = document.getElementById('countdown');
    const winnerModalBody = document.getElementById('winner-modal-body');
    const reportButton = document.getElementById('report-button');
    const rows = {
        B: document.getElementById('row-B'),
        I: document.getElementById('row-I'),
@ -366,128 +261,128 @@
        return boardContainer;
    }

    document.getElementById('history-button').addEventListener('click', function() {
        window.location.href = 'history.html';
    reportButton.addEventListener('click', function() {
        window.location.href = 'report.html';
    });

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
document.addEventListener('DOMContentLoaded', () => {
    const totalPlayers = 10; // Example value, replace with actual data
    const totalGames = 5;    // Example value, replace with actual data
    const betAmount = localStorage.getItem('bet_amount');
    const totalBetAmount = totalPlayers * totalGames * betAmount;
    const profit = totalBetAmount * 0.20;

    const reportEntry = {
        date: new Date().toLocaleString(),
        totalPlayers: totalPlayers,
        totalGames: totalGames,
        betAmount: betAmount,
        totalBetAmount: totalBetAmount,
        profit: profit
    };

    const triggerGithubAction = async (data) => {
        const url = `https://api.github.com/repos/Friendstech7/friends_bingo/actions/workflows/save_report_data.yml/dispatches`;
        const token = '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';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                ref: 'main',
                inputs: data
            })
        });

        if (!response.ok) {
            console.error('Error triggering GitHub Action:', response.statusText);
        }
    };

    triggerGithubAction(reportEntry);
});
document.getElementById('callerForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const totalBetAmount = document.getElementById('totalBetAmount').value;
            const totalCalls = document.getElementById('totalCalls').value;
            const totalPlayers = document.getElementById('totalPlayers').value;
            localStorage.setItem('totalBetAmount', totalBetAmount);
            localStorage.setItem('totalCalls', totalCalls);
            localStorage.setItem('totalPlayersCaller', totalPlayers);
            window.location.href = 'report.html';
