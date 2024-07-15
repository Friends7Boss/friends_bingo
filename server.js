const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const recordsFile = 'records.json';

app.use(bodyParser.json());
app.use(cors());

app.post('/saveReport', (req, res) => {
    const record = req.body;
    fs.readFile(recordsFile, (err, data) => {
        let records = [];
        if (!err) {
            records = JSON.parse(data);
        }
        records.push(record);
        fs.writeFile(recordsFile, JSON.stringify(records), (err) => {
            if (err) return res.status(500).send('Error saving record');
            res.send('Record saved');
        });
    });
});

app.get('/getRecords', (req, res) => {
    fs.readFile(recordsFile, (err, data) => {
        if (err) return res.status(500).send('Error reading records');
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
