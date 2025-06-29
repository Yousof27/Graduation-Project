import styles from "./DiagnosisRecords.module.css";
import { useSelector } from "react-redux";
import { useUserDiagnosis } from "../../../redux/diagnosis/diagnosisApis";

const DiagnosisRecords = () => {
  const user = useSelector((state) => state?.auth?.user);
  const { data: diagnosisRecords = [], isLoading, isError } = useUserDiagnosis(user?.id);

  return (
    <div className={styles.diagnosisRecords}>
      <div className={styles.sectionCard}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Diagnosis Records </h3>
            <p className={styles.subtitle}>Your complete Diagnosis history and reports</p>
          </div>
        </div>

        <div className={styles.recordsList}>
          {isLoading && <p>Loading diagnosis records...</p>}
          {isError && <p>Failed to load diagnosis records.</p>}
          {!isLoading && diagnosisRecords.length === 0 && <p>No diagnosis records found.</p>}
          {diagnosisRecords.map((record, idx) => {
            const recordDate = record.date ? new Date(record.date) : null;
            const formattedDate = recordDate ? recordDate.toLocaleDateString() : "No date";
            // Color based on result
            let borderColor = "#6366f1";
            if (record.result?.toLowerCase() === "normal") borderColor = "#10b981";
            else if (record.result?.toLowerCase() === "mild") borderColor = "#f59e42";
            else if (record.result?.toLowerCase() === "moderate") borderColor = "#fbbf24";
            else if (record.result?.toLowerCase() === "severe") borderColor = "#ef4444";

            return (
              <div
                className={styles.recordItem}
                key={record.id || idx}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  background: "#fff",
                  borderLeft: `6px solid ${borderColor}`,
                  borderRadius: 16,
                  boxShadow: "0 4px 16px rgba(67, 56, 202, 0.08)",
                  marginBottom: 12,
                  padding: 0,
                  overflow: "hidden",
                  minHeight: 140,
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Diagnosis Image */}
                <div
                  style={{
                    width: 90,
                    height: 90,
                    background: "#f1f5f9",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(67,56,202,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                  className="m-[16px]"
                >
                  {record.urlOfImage ? (
                    <img src={record.urlOfImage} alt={record.result} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="fas fa-image" style={{ fontSize: 36, color: "#c7d2fe" }}></i>
                  )}
                </div>
                {/* Diagnosis Details */}
                <div className={styles.recordDetails} style={{ flex: 1, padding: 20, minWidth: 0 }}>
                  <div
                    className={styles.recordHeader}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <h4
                      className={styles.recordTitle}
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: borderColor,
                        margin: 0,
                        textTransform: "capitalize",
                        letterSpacing: 0.5,
                      }}
                    >
                      {record.result || "Diagnosis Result"}
                    </h4>
                    <span className={styles.recordDate} style={{ color: "#64748b", fontWeight: 500, fontSize: 13 }}>
                      {formattedDate}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: "#fef3c7",
                        color: "#d97706",
                        borderRadius: 12,
                        padding: "3px 10px",
                        fontWeight: 600,
                        fontSize: 12,
                        display: "inline-block",
                      }}
                    >
                      Confidence: {record.confidence ? record.confidence.toFixed(2) + "%" : "N/A"}
                    </span>
                  </div>
                  {/* Confidence Progress Bar */}
                  {typeof record.confidence === "number" && (
                    <div style={{ width: "100%", marginBottom: 10 }}>
                      <div
                        style={{
                          background: "#e5e7eb",
                          borderRadius: 8,
                          height: 8,
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${record.confidence}%`,
                            background: borderColor,
                            height: "100%",
                            borderRadius: 8,
                            transition: "width 0.4s",
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <p className={styles.recordDescription} style={{ color: "#475569", margin: "6px 0 14px 0", fontSize: 14, wordBreak: "break-word" }}>
                    {record.description ||
                      `AI analysis detected a ${record.confidence ? record.confidence.toFixed(2) : "N/A"}% confidence level for: ${
                        record.result || "Unknown"
                      }.`}
                  </p>
                  <div className={styles.recordActions} style={{ display: "flex", gap: 10 }}>
                    <button
                      className={styles.viewButton}
                      style={{
                        background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                        boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <i className="fas fa-file-pdf"></i> Download Report
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisRecords;
