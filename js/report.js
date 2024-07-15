function saveReport() {
    const betAmount = document.getElementById("betAmount").value;
    const totalBetAmount = document.getElementById("totalBetAmount").value;
    const totalPlayers = document.getElementById("totalPlayers").value;
    const totalCalls = document.getElementById("totalCalls").value;

    const record = {
        date: new Date().toLocaleDateString(),
        betAmount,
        totalBetAmount,
        totalPlayers,
        totalCalls
    };

    fetch('http://localhost:3000/saveReport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
    }).then(response => response.text())
    .then(data => {
        console.log(data);
        loadRecords();
    }).catch(error => {
        console.error('Error:', error);
    });
}

function loadRecords() {
    fetch('http://localhost:3000/getRecords')
    .then(response => response.json())
    .then(records => {
        const recordsTable = document.getElementById("recordsTable").getElementsByTagName("tbody")[0];
        recordsTable.innerHTML = "";

        records.forEach(record => {
            const row = recordsTable.insertRow();
            row.insertCell(0).textContent = record.date;
            row.insertCell(1).textContent = record.betAmount;
            row.insertCell(2).textContent = record.totalBetAmount;
            row.insertCell(3).textContent = record.totalPlayers;
            row.insertCell(4).textContent = record.totalCalls;
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}
