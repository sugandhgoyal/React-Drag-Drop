import { http, HttpResponse } from "msw";

const STORAGE_KEY = "documentsData";

// Initial data
const initialData = [
  { type: "bank-draft", title: "Bank Draft", position: 0 },
  { type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { type: "invoice", title: "Invoice", position: 2 },
  { type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

// Initialize localStorage with the initial data if not already set
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export const handlers = [
  // Fetch all documents from localStorage
  http.get("/api/documents", (_, res, ctx) => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    console.log(data);
    return HttpResponse.json(data, { status: 201 });
  }),
  // Add a new document to localStorage
  http.post("/api/documents", (req, res, ctx) => {
    const newDocument = req.body;
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    data.push(newDocument);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return HttpResponse.json("Document added successfully", { status: 201 });
  }),

  // Reset data in localStorage to the initial state
  http.post("/api/reset", (req, res, ctx) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return HttpResponse.json("Data reset to initial state", { status: 200 });
  }),
];
