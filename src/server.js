const express = require("express");
const app = express();
const port = 4000;

app.use(express.json());

let documents = [
  { type: "bank-draft", title: "Bank Draft", position: 0 },
  { type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { type: "invoice", title: "Invoice", position: 2 },
  { type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

// Get all documents
app.get("/api/documents", (req, res) => {
  res.json(documents);
});

// Add a new document
app.post("/api/documents", (req, res) => {
  const newDoc = req.body;
  documents.push(newDoc);
  res.status(201).json(newDoc);
});

app.listen(port, () => {
  console.log(`Mock API server running on port ${port}`);
});
