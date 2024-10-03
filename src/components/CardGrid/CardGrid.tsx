import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Spinner from "../Spinner/Spinner";

interface Document {
  type: string;
  title: string;
}

interface CardGridProps {
  documents: Document[];
  openModal: (thumbnail: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ documents, openModal, loading, setLoading }) => {
  const getThumbnail = (type: string): string => {
    switch (type) {
      case "bank-draft":
        return "/images/bill.jpg";
      case "bill-of-lading":
        return "/images/bill2.jpg";
      case "invoice":
        return "/images/bill3.jpg";
      default:
        return "/images/bill4.jpg";
    }
  };

  return (
    <div className="card-grid">
      {documents.map(
        (doc, index) =>
          doc && (
            <Draggable key={doc.type} draggableId={doc.type} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="card"
                  onClick={() => openModal(getThumbnail(doc.type))}
                >
                  <Spinner
                    src={getThumbnail(doc.type)}
                    alt={doc.title}
                    loading={loading}
                    setLoading={setLoading}
                  />
                  <h3>{doc.title}</h3>
                </div>
              )}
            </Draggable>
          )
      )}
    </div>
  );
};

export default CardGrid;