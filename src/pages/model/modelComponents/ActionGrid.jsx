// src/components/ActionGrid.jsx
import React from "react";
import "./styles/actionGrid.css"; // Import your separated Tailwind classes
// import "./styles/animations.css"; // Import your separated Tailwind classes
import "./styles/animations.css";
export default function ActionGrid({ visible, onShowMenu }) {
  if (!visible) return null;

  return (
    <div id="actionGrid" className="action-grid-container">
      <div className="action-grid-card" onClick={() => onShowMenu("consultation")}>
        <i className="fas fa-stethoscope action-grid-icon"></i>
        <div className="action-grid-title">Contact Doctor</div>
        <p className="action-grid-desc">Connect with certified ophthalmologists for evaluation.</p>
      </div>

      <div className="action-grid-card" onClick={() => onShowMenu("medications")}>
        <i className="fas fa-prescription-bottle-alt action-grid-icon"></i>
        <div className="action-grid-title">Suggested Medications</div>
        <p className="action-grid-desc">Explore evidence-based medication protocols.</p>
      </div>

      <div className="action-grid-card" onClick={() => onShowMenu("resources")}>
        <i className="fas fa-graduation-cap action-grid-icon"></i>
        <div className="action-grid-title">Educational Content</div>
        <p className="action-grid-desc">Access the latest research in retinal pathology.</p>
      </div>
    </div>
  );
}
