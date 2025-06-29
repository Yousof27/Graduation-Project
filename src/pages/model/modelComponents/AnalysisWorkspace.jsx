// src/components/AnalysisWorkspace.jsx
import React, { useRef } from "react";
import "./styles/analysisWorkspace.css"; // Import your CSS here

export default function AnalysisWorkspace(props) {
  let {
    uploadedURL,
    showDropZone,
    showAnalyzeBtn,
    showUploadAnother,
    showScanViz,
    showAnalysisProgress,
    progressStep,
    showDiagnosisResult,
    diagnosisName,
    confidenceScore,
    confidenceFillWidth,
    handleFileSelect,
    uploadAnotherImage,
    runAnalysis,
    downloadPDF, // Ensure this prop is destructured
  } = props;

  // const diagnosisStatge = diagnosisName;
  const stages = ["Mild", "Moderate", "Severe", "Proliferate_DR"];

  if (stages.includes(diagnosisName)) {
    diagnosisName = `Diabetic Retinopathy in stage  ${diagnosisName}`;
  }
  const fileInputRef = useRef(null);

  const onDropZoneClick = () => fileInputRef.current?.click();
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="analysis-grid">
      <div className="left-panel">
        <h2 className="section-title">
          <i className="mr-2 fas fa-upload"></i> Image Uploading
        </h2>

        {showDropZone && (
          <div
            id="dropZone"
            className="drop-zone"
            onClick={onDropZoneClick}
            onDragOver={onDragOver}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <i className="fas fa-camera-retro drop-zone-icon"></i>
            <div className="drop-zone-text">Upload Retinal Fundus Image</div>
            <div className="drop-zone-subtext">Drop files here or click to browse</div>
            <div className="drop-zone-subtext">Supports: JPEG, PNG • Max: 10MB</div>
          </div>
        )}

        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={onFileChange} />

        {!showDropZone && <img id="uploadedImage" className="uploaded-image" src={uploadedURL} alt="Uploaded" loading="lazy" />}

        {showAnalyzeBtn && (
          <button onClick={runAnalysis} id="analyzeBtn" className="analyze-btn">
            <i className="mr-2 fas fa-brain"></i> Initialize Neural Analysis
          </button>
        )}

        {showUploadAnother && (
          <button id="uploadAnotherBtn" onClick={uploadAnotherImage} className="upload-another-btn">
            Upload Another Image
          </button>
        )}
      </div>

      <div className="right-panel">
        <h2 className="section-title">
          <i className="mr-2 fas fa-chart-line"></i> Diagnostic Results
        </h2>

        {showScanViz && (
          <div id="scanViz" className="scan-viz">
            <div className="scan-bar"></div>
          </div>
        )}

        {showAnalysisProgress && (
          <div id="analysisProgress" className="progress-section">
            {[
              { icon: "fas fa-image", text: "Preprocessing image data..." },
              { icon: "fas fa-brain", text: "Running neural network inference..." },
              { icon: "fas fa-chart-bar", text: "Computing confidence metrics..." },
              { icon: "fas fa-check", text: "Analysis complete" },
            ].map((step, idx) => {
              const isComplete = idx < progressStep;
              return (
                <div
                  key={idx}
                  className="progress-item"
                  style={{
                    animationDelay: `${0.3 * (idx + 1)}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className={`progress-icon ${isComplete ? "complete" : ""}`}>
                    <i className={step.icon}></i>
                  </div>
                  <div className={`progress-text ${isComplete ? "complete" : ""}`}>{step.text}</div>
                </div>
              );
            })}
          </div>
        )}

        {showDiagnosisResult && (
          <div id="diagnosisResult" className="diagnosis-result">
            <div className="result-box">
              <div id="diagnosisName" className="diagnosis-name">{diagnosisName}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Confidence Score</span>
                  <span id="confidenceScore">{confidenceScore}</span>
                </div>
                <div className="confidence-bar">
                  <div id="confidenceFill" className="confidence-fill" style={{ width: confidenceFillWidth }}></div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    downloadPDF();
                  }}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 animate-fadeInUp"
                >
                  Download PDF Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
