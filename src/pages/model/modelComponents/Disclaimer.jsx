// src/components/Disclaimer.jsx
import React from "react";
import "./styles/disclaimer.css";

export default function Disclaimer({ visible }) {
  if (!visible) return null;

  return (
    <div className="disclaimer-container">
      <div className="disclaimer-header">
        {/* Keep FontAwesome classes here directly */}
        <i className="fas fa-exclamation-triangle disclaimer-icon"></i>
        <strong>Critical Medical Advisory</strong>
      </div>
      <p className="disclaimer-text">
        This AI-powered diagnostic tool is designed for research and educational purposes. Results are probabilistic and should never replace
        professional medical evaluation. Consult qualified healthcare providers for accurate diagnosis and treatment. The platform disclaims
        responsibility for medical decisions based on these automated analyses.
      </p>
    </div>
  );
}
