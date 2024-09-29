import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CardGrid from "./components/CardGrid/CardGrid";
import Modal from "react-modal";
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
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(0); // Timer since last save
  const [hasChanges, setHasChanges] = useState(false); // Track if there are changes

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
  const onDragEnd = (result) => {
    const { source, destination } = result;

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
    setHasChanges(true);

    // Optionally, save the reordered list back to localStorage via the API
    localStorage.setItem("documentsData", JSON.stringify(reorderedDocuments));
  };

  // Save changes to the API
  const saveChanges = async () => {
    if (!hasChanges) return; // If no changes have been made, do not save & returnn

    setIsSaving(true);
    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documents),
      });
      //Reset the timers
      setHasChanges(false);
      setLastSavedTime(0);
    } catch (error) {
      console.error("Error saving documents", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveChanges();
    }, 10000);

    return () => clearInterval(interval);
  }, [documents, hasChanges]);

  // Increment the timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSavedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div>
      <h1>Documents</h1>
      {isSaving && <div className="saving-spinner">Saving...</div>}
      <p>Last saved {lastSavedTime} seconds ago</p>

      {/* DragDropContext to handle the drag-and-drop events */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="documents" direction="horizontal">
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
      <Modal
        isOpen={isOpen && !loading}
        onRequestClose={closeModal}
        className="modal"
      >
        <button onClick={closeModal}>Close</button>
        {selectedImage && <img src={selectedImage} alt="Document" />}
      </Modal>
      <button onClick={addDocument}>Add New Document</button>
    </div>
  );
};

export default App;
