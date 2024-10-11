// utils/csvUtils.js
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');

const exportProjectsToCSV = async (projects) => {
    const csvWriter = createObjectCsvWriter({
        path: 'projects_export.csv',
        header: [
            { id: 'title', title: 'Title' },
            { id: 'description', title: 'Description' },
            { id: 'status', title: 'Status' },
            { id: 'startDate', title: 'Start Date' },
            { id: 'endDate', title: 'End Date' },
            { id: 'createdBy', title: 'Created By' },
            { id: 'createdAt', title: 'Created At' },
            { id: 'updatedAt', title: 'Updated At' },
        ],
    });

    await csvWriter.writeRecords(projects);
    return 'projects_export.csv';
};

const importProjectsFromCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

module.exports = { exportProjectsToCSV, importProjectsFromCSV };
