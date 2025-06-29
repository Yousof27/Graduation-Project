import React from 'react';
import styles from './MedicalRecords.module.css';

const MedicalRecords = () => {
  return (
    <div className={styles.medicalRecords}>
      <div className={styles.sectionCard}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Medical Records</h3>
            <p className={styles.subtitle}>Your complete medical history and reports</p>
          </div>
        </div>

        <div className={styles.recordsList}>
          <div className={styles.recordItem}>
            <div className={styles.recordContent}>
              <div className={`${styles.recordIcon} ${styles.blueIcon}`}>
                <i className="fas fa-stethoscope"></i>
              </div>
              <div className={styles.recordDetails}>
                <div className={styles.recordHeader}>
                  <h4 className={styles.recordTitle}>Annual Eye Examination</h4>
                  <span className={styles.recordDate}>June 15, 2023</span>
                </div>
                <p className={styles.recordDescription}>
                  Comprehensive eye exam with dilation. Visual acuity: 20/20 both eyes. 
                  Fundus examination normal. Intraocular pressure: 14mmHg both eyes.
                </p>
                <div className={styles.recordActions}>
                  <button className={styles.viewButton}>
                    <i className="fas fa-file-pdf"></i> View Report
                  </button>
                  <button className={styles.shareButton}>
                    <i className="fas fa-share-alt"></i> Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.recordItem}>
            <div className={styles.recordContent}>
              <div className={`${styles.recordIcon} ${styles.indigoIcon}`}>
                <i className="fas fa-robot"></i>
              </div>
              <div className={styles.recordDetails}>
                <div className={styles.recordHeader}>
                  <h4 className={styles.recordTitle}>AI Retinal Analysis</h4>
                  <span className={`${styles.recordDate} ${styles.indigoDate}`}>June 10, 2023</span>
                </div>
                <p className={styles.recordDescription}>
                  AI analysis detected minor changes in retinal vessels. Recommendation: 
                  Schedule follow-up in 6 months. Confidence score: 92%.
                </p>
                <div className={styles.badgeContainer}>
                  <span className={`${styles.badge} ${styles.indigoBadge}`}>AI Generated</span>
                  <span className={`${styles.badge} ${styles.amberBadge}`}>Follow-up Needed</span>
                </div>
                <div className={styles.recordActions}>
                  <button className={styles.analysisButton}>
                    <i className="fas fa-chart-line"></i> View Analysis
                  </button>
                  <button className={styles.downloadButton}>
                    <i className="fas fa-download"></i> Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.recordItem}>
            <div className={styles.recordContent}>
              <div className={`${styles.recordIcon} ${styles.emeraldIcon}`}>
                <i className="fas fa-eye-dropper"></i>
              </div>
              <div className={styles.recordDetails}>
                <div className={styles.recordHeader}>
                  <h4 className={styles.recordTitle}>Contact Lens Fitting</h4>
                  <span className={`${styles.recordDate} ${styles.emeraldDate}`}>January 20, 2023</span>
                </div>
                <p className={styles.recordDescription}>
                  Fitted with monthly disposable contact lenses. Base curve: 8.6mm, 
                  Diameter: 14.2mm, Power: -2.00 both eyes.
                </p>
                <div className={styles.recordActions}>
                  <button className={styles.prescriptionButton}>
                    <i className="fas fa-file-prescription"></i> Prescription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;