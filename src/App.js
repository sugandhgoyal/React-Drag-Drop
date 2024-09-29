import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Modal from "react-modal";
import CardGrid from "./components/CardGrid/CardGrid";
import "./App.css";

const App = () => {
  const [documents, setDocuments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the static JSON from the data.json
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => setDocuments(data));
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedDocs = Array.from(documents);
    const [moved] = reorderedDocs.splice(result.source.index, 1);
    reorderedDocs.splice(result.destination.index, 0, moved);
    setDocuments(reorderedDocs);
  };

  return (
    <div className="App">
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
    </div>
  );
};

export default App;
