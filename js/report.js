document.addEventListener("DOMContentLoaded", function() {
    loadRecords();

    // Populate the form with data from localStorage
    document.getElementById('betAmount').value = localStorage.getItem('betAmount') || '';
    document.getElementById('totalBetAmount').value = localStorage.getItem('totalBetAmount') || '';
    document.getElementById('totalPlayers').value = localStorage.getItem('totalPlayersCaller') || localStorage.getItem('totalPlayers') || '';
    document.getElementById('totalCalls').value = localStorage.getItem('totalCalls') || '';

    document.getElementById("reportForm").addEventListener("submit", function(event) {
        event.preventDefault();
        saveReport();
    });
});

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

    let records = JSON.parse(localStorage.getItem("bingoRecords")) || [];
    records.push(record);
    localStorage.setItem("bingoRecords", JSON.stringify(records));

    loadRecords();
}

function loadRecords() {
    const records = JSON.parse(localStorage.getItem("bingoRecords")) || [];
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
}
