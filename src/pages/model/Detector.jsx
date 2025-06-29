import { useState, useEffect } from "react";
import Hero from "./modelComponents/Hero";
import AnalysisWorkspace from "./modelComponents/AnalysisWorkspace";
import Disclaimer from "./modelComponents/Disclaimer";
import ActionGrid from "./modelComponents/ActionGrid";
import SideMenu from "./modelComponents/SideMenu";
import { useDoctors } from "../../redux/doctors/doctorsApis";
import { useAllPosts, useSavePost, useRemoveSavedPost, useUserSavedPosts } from "../../redux/posts/postsApis";
import { useProducts } from "../../redux/products/productsApis";
import "./Detector.css";
import { jsPDF } from "jspdf";
import { useSelector } from "react-redux";
import { successMessage } from "../../redux/toasts";
import { useAddUserDiagnosis } from "../../redux/diagnosis/diagnosisApis";
import { Navigate } from "react-router-dom";

// "../../assets/"
export default function Detector() {
  /** ─────────── STATE HOOKS ─────────── **/
  const [uploadedURL, setUploadedURL] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [serverURL, setServerURL] = useState(""); // New state for server URL
  const [showDropZone, setShowDropZone] = useState(true);
  const [showAnalyzeBtn, setShowAnalyzeBtn] = useState(false);
  const [showUploadAnother, setShowUploadAnother] = useState(false);
  const [showScanViz, setShowScanViz] = useState(false);
  const [showAnalysisProgress, setShowAnalysisProgress] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showDiagnosisResult, setShowDiagnosisResult] = useState(false);
  const [diagnosisName, setDiagnosisName] = useState("Awaiting Analysis");
  const [confidenceScore, setConfidenceScore] = useState("--");
  const [confidenceFillWidth, setConfidenceFillWidth] = useState("0%");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showActionGrid, setShowActionGrid] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [sideMenuTitle, setSideMenuTitle] = useState("");
  const [sideMenuItems, setSideMenuItems] = useState([]);
  const [sideMenuMoreUrl, setSideMenuMoreUrl] = useState("");
  const [analysisDate, setAnalysisDate] = useState("");

  // Fetch data using hooks
  const doctorsQuery = useDoctors();
  const postsQuery = useAllPosts();
  const productsQuery = useProducts();

  const authData = useSelector((state) => state.auth);
  const user = authData?.user || {};
  const addDiagnosis = useAddUserDiagnosis(user?.id); // Ensure user.id is optional

  const { mutate: savePost } = useSavePost(user?.id);
  const { mutate: removePost } = useRemoveSavedPost(user?.id);
  const { data } = useUserSavedPosts(user?.id);

  const userPosts = authData?.user?.role === "client" ? data : [];

  /** ─────────── FILE HANDLING FUNCTIONS ─────────── **/
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const filename = file.name;
    const checkUrl = `http://127.0.0.1:8000/assets/uploadedImages/${filename}`;

    // Check if the image already exists on the server
    fetch(checkUrl, { method: "HEAD" })
      .then((response) => {
        if (response.ok) {
          // Image exists, fetch it for display and use for analysis
          return fetch(checkUrl)
            .then((res) => res.blob())
            .then((blob) => {
              const dataURL = URL.createObjectURL(blob);
              setUploadedURL(dataURL);
              setServerURL(checkUrl); // Set the server URL for existing image
              setUploadedFile(file);
              setShowDropZone(false);
              setShowAnalyzeBtn(true);
            });
        } else {
          // Image doesn't exist, proceed with upload
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataURL = e.target.result;
            const formData = new FormData();
            formData.append("file", file);

            fetch("http://127.0.0.1:8000/upload-image", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.url) {
                  setUploadedURL(dataURL);
                  setServerURL(data.url); // Store the server URL
                  setUploadedFile(file);
                  setShowDropZone(false);
                  setShowAnalyzeBtn(true);
                } else {
                  throw new Error("Invalid response from server");
                }
              })
              .catch((error) => {
                console.error("Upload error:", error);
                alert("Failed to upload image. Please try again.");
              });
          };
          reader.readAsDataURL(file);
        }
      })
      .catch((error) => {
        console.error("Error checking image existence:", error);
        alert("Error checking image. Proceeding with upload.");
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataURL = e.target.result;
          const formData = new FormData();
          formData.append("file", file);

          fetch("http://127.0.0.1:8000/upload-image", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.url) {
                setUploadedURL(dataURL);
                setServerURL(data.url);
                setUploadedFile(file);
                setShowDropZone(false);
                setShowAnalyzeBtn(true);
              } else {
                throw new Error("Invalid response from server");
              }
            })
            .catch((error) => {
              console.error("Upload error:", error);
              alert("Failed to upload image. Please try again.");
            });
        };
        reader.readAsDataURL(file);
      });
  };

  const uploadAnotherImage = () => {
    setShowDropZone(true);
    setUploadedURL("");
    setUploadedFile(null);
    setServerURL(""); // Reset server URL
    setShowAnalyzeBtn(false);
    setShowUploadAnother(false);
    setShowScanViz(false);
    setShowAnalysisProgress(false);
    setProgressStep(0);
    setShowDiagnosisResult(false);
    setDiagnosisName("Awaiting Analysis");
    setConfidenceScore("--");
    setConfidenceFillWidth("0%");
    setShowDisclaimer(false);
    setShowActionGrid(false);
    setSideMenuOpen(false);
    setSideMenuTitle("");
    setSideMenuItems([]);
    setSideMenuMoreUrl("");
  };

  /** ─────────── ANALYSIS & PROGRESS ─────────── **/
  const runAnalysis = async () => {
    if (!uploadedFile) {
      alert("No image file selected for analysis.");
      return;
    }

    setShowAnalyzeBtn(false);
    setShowScanViz(true);
    setShowAnalysisProgress(true);
    setAnalysisDate(new Date().toLocaleString("en-US", { timeZone: "Europe/Helsinki" }));

    setProgressStep(0);
    const totalSteps = 4;
    let current = 0;
    const stepInterval = setInterval(() => {
      current += 1;
      setProgressStep(current);
      if (current >= totalSteps) {
        clearInterval(stepInterval);
      }
    }, 1000);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      let { DiagnosisResult, ConfidenceScore } = result;

      if (!DiagnosisResult || typeof ConfidenceScore !== "number") {
        throw new Error("Invalid API response format");
      }

      setTimeout(() => {
        showResults(DiagnosisResult, ConfidenceScore);
        saveResults(DiagnosisResult, ConfidenceScore);
      }, 2000);
    } catch (error) {
      console.error("Error during analysis:", error);
      alert(`Failed to analyze image: ${error.message}`);
      setShowScanViz(false);
      setShowAnalysisProgress(false);
      setShowUploadAnother(true);
      clearInterval(stepInterval);
    }
  };

  /** ─────────── SHOW RESULTS ─────────── **/
  const showResults = (disease, confidence) => {
    // console.log("Show Results triggered with:", { disease, confidence });
    const confidencePercent = Math.min(Math.max(confidence, 0), 100).toFixed(0);

    setShowScanViz(false);
    setShowAnalysisProgress(false);
    setShowDiagnosisResult(true);
    setShowDisclaimer(true);
    setShowActionGrid(true);
    setShowUploadAnother(true);

    setDiagnosisName(disease);
    setConfidenceScore(confidencePercent + "%");
    setTimeout(() => {
      setConfidenceFillWidth(confidencePercent + "%");
    }, 500);
  };

  const saveResults = (disease, confidence) => {
    addDiagnosis.mutate({
      result: disease,
      confidence: confidence,
      urlOfImage: serverURL || "",
      date: new Date().toISOString(),
    });
  };

  /** ─────────── DOWNLOAD PDF ─────────── **/
  const downloadPDF = () => {
    // console.log("Download PDF triggered with:", {
    //   uploadedURL,
    //   diagnosisName,
    //   confidenceScore,
    //   analysisDate,
    // });
    const doc = new jsPDF();
    const imgData = uploadedURL;
    const date = analysisDate || new Date().toLocaleString("en-US", { timeZone: "Europe/Helsinki" });

    if (!imgData) {
      console.error("No image data available for PDF");
      alert("No image data available to generate PDF. Please upload an image first.");
      return;
    }

    try {
      // Set page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = pageWidth / 2;

      // Header with logo and platform name
      doc.setFillColor(23, 107, 135);
      doc.rect(0, 0, pageWidth, 30, "F");

      // Logo text
      doc.setFontSize(48);
      doc.setTextColor(230, 230, 230);
      doc.text("EYECARE HUB", pageWidth / 2, 150, { align: "center" });

      // Tagline
      doc.setFontSize(10);
      doc.text("Your Vision, Our Mission", 15, 26);

      // Report title
      doc.setFontSize(18);
      doc.setTextColor(23, 107, 135);
      doc.text("AI-Powered Retinal Analysis Report", centerX, 45, "center");

      // Analysis date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${date}`, centerX, 52, "center");

      // Patient information section
      doc.setFontSize(14);
      doc.setTextColor(23, 107, 135);
      doc.text("Patient Information", 15, 70);

      const patientInfo = [
        ["Name:", user?.username || "Unknown"],
        ["Age:", String(user?.age || "N/A")],
      ];

      // Write patient info
      let yPos = 80;
      patientInfo.forEach(([label, value]) => {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(label, 20, yPos);
        doc.setTextColor(0, 0, 0);
        doc.text(value, 60, yPos);
        yPos += 10;
      });

      // Uploaded image
      const imgWidth = 80;
      const imgHeight = 60;
      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(imgData, "PNG", imgX, yPos + 10, imgWidth, imgHeight);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Uploaded Retinal Image", centerX, yPos + imgHeight + 15, "center");

      // Analysis results section
      yPos += imgHeight + 30;
      doc.setFontSize(14);
      doc.setTextColor(23, 107, 135);
      doc.text("Analysis Results", 15, yPos);

      // Diagnosis
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Diagnosis:", 20, yPos + 15);
      doc.setFontSize(14);
      doc.setTextColor(23, 107, 135);
      doc.text(diagnosisName, 60, yPos + 15);

      // Confidence score
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Confidence:", 20, yPos + 30);
      doc.setFontSize(14);
      doc.setTextColor(23, 107, 135);
      doc.text(confidenceScore, 60, yPos + 30);

      // Visual confidence bar
      const confValue = parseInt(confidenceScore);
      const barWidth = 80;
      const barX = 60;
      doc.setFillColor(200, 230, 255);
      doc.rect(barX, yPos + 35, barWidth, 8, "F");
      doc.setFillColor(23, 107, 135);
      doc.rect(barX, yPos + 35, (barWidth * confValue) / 100, 8, "F");

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This report was generated by EyeCare Hub's AI diagnostic system", centerX, 280, "center");
      doc.text("Always consult with a medical professional for final diagnosis", centerX, 285, "center");

      // Watermark
      doc.setFontSize(48);
      doc.setTextColor(230, 230, 230);
      doc.text("EYECARE HUB", centerX, 150, "center");

      doc.save(`EyeCare_Report_${user?.username || "User"}_${date.replace(/[:/]/g, "-")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  /** ─────────── SIDE MENU HANDLER ─────────── **/
  const handleShowMenu = (type) => {
    let items = [];
    let title = "";
    let moreUrl = "";

    if (type === "consultation") {
      title = "Contact Doctor";
      items =
        doctorsQuery.data?.map((doctor) => ({
          id: doctor.id,
          image: doctor.profileImage,
          name: doctor.fullname,
          specialty: doctor.specialty,
          location: doctor.clinicLocation,
          rating: doctor.ratings,
          availability: doctor.availableDays.join(", "),
          bio: doctor.bio,
          social: {
            facebook: doctor.socialLinks?.facebook,
            twitter: doctor.socialLinks?.twitter,
            linkedin: doctor.socialLinks?.linkedin,
          },
        })) || [];
      moreUrl = "/doctors";
    } else if (type === "medications") {
      const stages = ["Mild", "Moderate", "Severe", "Proliferate_DR"];
      let stage = diagnosisName;
      if (stages.includes(diagnosisName)) {
        stage = "Diabetic Retinopathy";
        title = "Suggested Medications";
        items =
          productsQuery.data
            ?.filter((product) => stage !== "Awaiting Analysis" && product.disease && product.disease.toLowerCase().includes(stage.toLowerCase()))
            .map((product) => ({
              id: product.id,
              name: product.name,
              brand: product.brand,
              desc: product.desc,
              sideEffect: product.sideEffect,
              type: product.type,
              disease: product.disease,
              category: product.category,
              price: product.price,
              maxQuantity: product.maxQuantity,
              sales: product.sales,
              url: product.url,
            })) || [];
        moreUrl = "/market";
      } else {
        title = "Suggested Medications";
        items =
          productsQuery.data
            ?.filter(
              (product) =>
                diagnosisName !== "Awaiting Analysis" && product.disease && product.disease.toLowerCase().includes(diagnosisName.toLowerCase())
            )
            .map((product) => ({
              id: product.id,
              name: product.name,
              brand: product.brand,
              desc: product.desc,
              sideEffect: product.sideEffect,
              type: product.type,
              disease: product.disease,
              category: product.category,
              price: product.price,
              maxQuantity: product.maxQuantity,
              sales: product.sales,
              url: product.url,
            })) || [];
        moreUrl = "/market";
      }
    } else {
      title = "Educational Content";
      items =
        postsQuery.data?.map((post) => ({
          id: post.id,
          icon: post.icon || "FaBook",
          type: post.type || "article",
          title: post.title,
          category: post.category,
          readTime: post.readTime,
          author: post.author,
          description: post.description,
          content: post.content,
        })) || [];
      moreUrl = "/educationalContent";
    }

    setSideMenuTitle(title);
    setSideMenuItems(items);
    setSideMenuMoreUrl(moreUrl);
    setSideMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setSideMenuOpen(false);
  };

  /** ─────────── MOUSEMOVE LISTENER FOR CSS VARS ─────────── **/
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty("--mouse-x", x);
      document.documentElement.style.setProperty("--mouse-y", y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (authData?.user?.role === "admin") return <Navigate to="/unauthorized" />;

  return (
    <div className="px-6 mx-auto mt-24 max-w-7xl">
      <Hero />
      <AnalysisWorkspace
        uploadedURL={uploadedURL}
        showDropZone={showDropZone}
        showAnalyzeBtn={showAnalyzeBtn}
        showUploadAnother={showUploadAnother}
        showScanViz={showScanViz}
        showAnalysisProgress={showAnalysisProgress}
        progressStep={progressStep}
        showDiagnosisResult={showDiagnosisResult}
        diagnosisName={diagnosisName}
        confidenceScore={confidenceScore}
        confidenceFillWidth={confidenceFillWidth}
        handleFileSelect={handleFileSelect}
        uploadAnotherImage={uploadAnotherImage}
        runAnalysis={runAnalysis}
        downloadPDF={downloadPDF}
      />
      <Disclaimer visible={showDisclaimer} />
      <ActionGrid visible={showActionGrid} onShowMenu={handleShowMenu} />
      <SideMenu
        isOpen={sideMenuOpen}
        onClose={handleCloseMenu}
        title={sideMenuTitle}
        items={sideMenuItems}
        userRole={user?.role}
        moreUrl={sideMenuMoreUrl}
        savePost={savePost}
        removePost={removePost}
        userPosts={userPosts}
        successMessage={successMessage}
      />
    </div>
  );
}
