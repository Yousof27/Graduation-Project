import styles from "./Invoices.module.css";
import { useSelector } from "react-redux";
import { useUserBillsHistory } from "../../../redux/bills/billsApi";

const Invoices = () => {
  const user = useSelector((state) => state?.auth?.user);
  const { data: bills = [], isLoading, isError } = useUserBillsHistory(user?.id);

  let totalPaid = 0;
  if (bills && bills.length > 0) {
    totalPaid = bills.reduce((sum, bill) => sum + (bill.totalPrice || 0), 0);
  }

  return (
    <div className={styles.invoices}>
      <div className={styles.sectionCard}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Invoices</h3>
            <p className={styles.subtitle}>Payment history and receipts</p>
          </div>
        </div>

        <div className={styles.invoicesList}>
          {isLoading && <p>Loading invoices...</p>}
          {isError && <p>Failed to load invoices.</p>}
          {!isLoading && bills && bills.length === 0 && <p>No invoices found.</p>}
          {bills &&
            bills.map((bill, idx) => {
              const orderDate = bill.orderDate ? new Date(bill.orderDate) : null;
              const formattedDate = orderDate ? orderDate.toLocaleDateString() : "No date";
              const formattedTime = orderDate ? orderDate.toLocaleTimeString() : "No time";
              return (
                <div className={styles.invoiceItem} key={bill.id || idx}>
                  <div className={styles.invoiceContent}>
                    <div className={`${styles.invoiceIcon} ${styles.blueIcon}`}>
                      <i className="fas fa-file-invoice-dollar"></i>
                    </div>
                    <div className={styles.invoiceDetails}>
                      <h4 className={styles.invoiceTitle}>{bill.title || `Invoice #${bill.id || idx + 1}`}</h4>
                      <p className={styles.invoiceDate}>{formattedDate}</p>
                      <p className={styles.invoiceDate}>{formattedTime}</p>
                    </div>
                  </div>
                  <div className={styles.invoiceAmount}>
                    <p className={styles.price}>${bill.totalPrice?.toFixed(2) || 0}</p>
                    <span className={`${styles.badge} ${styles.paidBadge}`}>Paid</span>
                  </div>
                </div>
              );
            })}
        </div>

        <div className={styles.totalSection}>
          <div className={styles.totalContent}>
            <div className={styles.totalLabel}>Total paid this year</div>
            <div className={styles.totalAmount}>${totalPaid.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
