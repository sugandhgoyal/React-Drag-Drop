import React, { useState } from "react";
import "./spinner.css";

const Spinner = ({ src, alt, loading, setLoading }) => {
  return (
    <div className="thumbnail">
      {loading && <div className="spinner"></div>}
      {!loading && (
        <img
          src={src}
          alt={alt}
          onLoad={() => {
            setLoading(false);
          }}
          style={{ display: loading ? "none" : "block" }}
        />
      )}
    </div>
  );
};

export default Spinner;
