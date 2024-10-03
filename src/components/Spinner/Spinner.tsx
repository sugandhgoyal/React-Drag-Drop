import React from "react";
import "./spinner.css";

interface SpinnerProps {
  src: string;
  alt: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const Spinner: React.FC<SpinnerProps> = ({ src, alt, loading, setLoading }) => {
  console.log("@@@ loading", { loading, setLoading });

  return (
    <div className="thumbnail">
      {loading && <div className="spinner"></div>}
      {!loading && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoading(false)}
          style={{ display: loading ? "none" : "block" }}
        />
      )}
    </div>
  );
};

export default Spinner;
