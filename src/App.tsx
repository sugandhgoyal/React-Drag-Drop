import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import CardGrid from "./components/CardGrid/CardGrid";
import Modal from "react-modal";
import "./App.css";

interface Document {
  type: string;
  title: string;
  position: number;
}

const reorder = (
  list: Document[],
  startIndex: number,
  endIndex: number
): Document[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data: Document[] = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents", error);
    }
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const addDocument = async () => {
    const newDocument: Document = {
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
      fetchDocuments();
    } catch (error) {
      console.error("Error adding document", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const reorderedDocuments = reorder(
      documents,
      source.index,
      destination.index
    );
    setDocuments(reorderedDocuments);
    setHasChanges(true);

    localStorage.setItem("documentsData", JSON.stringify(reorderedDocuments));
  };

  const saveChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documents),
      });
      setHasChanges(false);
      setLastSavedTime(0);
    } catch (error) {
      console.error("Error saving documents", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      saveChanges();
    }, 5000);

    return () => clearInterval(interval);
  }, [documents, hasChanges]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSavedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      setLastSavedTime(0);
    };
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div>
      <h1>Documents</h1>
      {(isSaving || hasChanges) && (
        <div className="saving-spinner">
          <p>saving....</p>
        </div>
      )}
      <p>Last saved {lastSavedTime} seconds ago</p>

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
