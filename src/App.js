import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CardGrid from "./components/CardGrid/CardGrid";
import "./App.css";

// Function to reorder the documents array based on drag result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const App = () => {
  const [documents, setDocuments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch documents from the mocked API and update state
  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents", error);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  // Add a new document
  const addDocument = async () => {
    const newDocument = {
      type: `new-doc-${documents.length}`,
      title: `New Document ${documents.length}`,
      position: documents.length,
    };

    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDocument),
      });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Error adding document", error);
    }
  };

  // Handle the drag end event, reorder the list, and update state
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If the item is dropped outside the list, do nothing
    if (!destination) {
      return;
    }

    // Reorder the documents array
    const reorderedDocuments = reorder(
      documents,
      source.index,
      destination.index
    );
    setDocuments(reorderedDocuments);

    // Optionally, save the reordered list back to localStorage via the API
    localStorage.setItem("documentsData", JSON.stringify(reorderedDocuments));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div>
      <h1>Documents</h1>

      {/* DragDropContext to handle the drag-and-drop events */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="documents">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid-container"
            >
              <CardGrid
                documents={documents}
                openModal={openModal}
                loading={loading}
                setLoading={setLoading}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={addDocument}>Add New Document</button>
    </div>
  );
};

export default App;
