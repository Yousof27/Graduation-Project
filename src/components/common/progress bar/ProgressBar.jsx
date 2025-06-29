import { useEffect, useState } from "react";

export default function ProgressBar({ loading }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval;

    if (loading) {
      setVisible(true);
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);
    } else if (!loading && visible) {
      setProgress(100);

      setTimeout(() => {
        setVisible(false); // hide after reaching 100%
      }, 100); // give a little time to show 100%
    }

    return () => clearInterval(interval);
  }, [loading, visible]);

  if (!visible) return null; // hide component completely

  return (
    <div className="w-full h-2 mt-4 overflow-hidden bg-gray-200 rounded">
      <div className="h-full transition-all duration-100 ease-linear bg-blue-500" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
