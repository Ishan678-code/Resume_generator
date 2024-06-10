const http = require('http');
const fs = require('fs');
const { generatePDF } = require('./process.js');
const port = 2000;

const server = http.createServer((req, res) => {
    console.log(`Received request for ${req.url}`);

    if (req.method === 'GET') {
        if (req.url === '/') {
            res.setHeader('Content-Type', 'application/json');

            fs.readFile('downloadedData.json', 'utf8', (err, data) => {
                if (err) {
                    console.error("Error reading data:", err);
                    res.statusCode = 500;
                    res.end("Data not received");
                    return;
                }

                const jsondata = JSON.parse(data);
                const jsonstring = JSON.stringify(jsondata);
                res.statusCode = 200;
                res.end(jsonstring);
            });
        } else if (req.url === '/download-pdf') {
            fs.readFile('downloadedData.json', 'utf8', (err, data) => {
                if (err) {
                    console.error("Error reading data:", err);
                    res.statusCode = 500;
                    res.end("Data not received");
                    return;
                }

                const jsonData = JSON.parse(data);
                const pdfDoc = generatePDF(jsonData);

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=Resume.pdf');
                res.statusCode = 200;

                
                pdfDoc.pipe(res);
                pdfDoc.end();
            });
        } else {
            res.statusCode = 404;
            res.end("Not Found");
        }
    } else {
        res.statusCode = 405; 
        res.end("Method Not Allowed");
    }
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
