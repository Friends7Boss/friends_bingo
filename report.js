import React, { useEffect, useState } from 'react';
import 'css/report.css';
import React from 'react';
import ReactDOM from 'react-dom';
import ReportPage from './ReportPage';

ReactDOM.render(<ReportPage />, document.getElementById('root'));

const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  const data = await response.json();
  return data;
};

const ReportPage = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const callerData = await fetchData('/api/caller');
        const indexData = await fetchData('/api/index');
        const combinedData = [...callerData, ...indexData];
        const processedData = combinedData.map((item, index) => ({
          id: index + 1,
          name: item.name,
          score: item.score,
          date: item.date,
        }));
        setRecords(processedData);
      } catch (error) {
        setError(error.message);
      }
    };
    loadRecords();
  }, []);

  return (
    <div className="report-container">
      <h1>Report Page</h1>
      {error && <div className="error">{error}</div>}
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.score}</td>
              <td>{record.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportPage;
