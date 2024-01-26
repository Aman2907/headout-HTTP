const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const dataFolder = '/tmp/data';

app.get('/data', async (req, res) => {
    const fileName = req.query.n;
    const lineNumber = req.query.m;

    if (!fileName) {
        return res.status(400).send("Error: 'n' parameter File name is required.");
    }

    const filePath = path.join(dataFolder, `${fileName}.txt`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');

        if (lineNumber) {
            const lineNumberInt = parseInt(lineNumber);

            if (isNaN(lineNumberInt) || lineNumberInt <= 0) {
                return res.status(400).send("Error: 'm' parameter (line number) must be a valid positive integer.");
            }

            const lines = fileContent.split('\n');

            if (lineNumberInt > lines.length) {
                return res.status(400).send(`Error: Line number '${lineNumberInt}' is out of range.`);
            }

            return res.send(lines[lineNumberInt - 1]);
        } else {
            return res.send(fileContent);
        }
    } catch (error) {
        return res.status(404).send(`Error: File '${fileName}.txt' not found.`);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


