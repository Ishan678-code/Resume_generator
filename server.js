const http = require("http");
const { generatePDF } = require("./process");

const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/json-data") {
    let jsonData = "";

    req.on("data", (chunk) => {
      jsonData += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(jsonData);
        console.log("Received JSON Data:");
        console.log(data);

        const doc = generatePDF(data);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="resume.pdf"'
        );
        doc.pipe(res);
        doc.end();
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Error parsing JSON data" }));
      }
    });
  } else {
    // Handle other requests
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
