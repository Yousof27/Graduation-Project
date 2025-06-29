import React, { useRef, useEffect, useState } from "react";
import { JEELIZVTOWIDGET } from "jeelizvtowidget";
import styles from "./index.module.css";
import ControlButton from "../ControlButton";

function initWidget(placeHolder, canvas, toggleLoading) {
  JEELIZVTOWIDGET.start({
    placeHolder,
    canvas,
    callbacks: {
      ADJUST_START: null,
      ADJUST_END: null,
      LOADING_START: toggleLoading.bind(null, true),
      LOADING_END: toggleLoading.bind(null, false),
    },
    sku: "empty",
    callbackReady: function () {
      console.log("INFO: JEELIZVTOWIDGET is ready :)");
    },
    onError: function (errorLabel) {
      console.error("Error during widget initialization:", errorLabel);
      alert("An error happened. errorLabel =" + errorLabel);
      switch (errorLabel) {
        case "WEBCAM_UNAVAILABLE":
          break;
        case "INVALID_SKU":
          break;
        case "PLACEHOLDER_NULL_WIDTH":
        case "PLACEHOLDER_NULL_HEIGHT":
          break;
        default:
          break;
      }
    },
  });
}

export function GlassArView(props) {
  const refPlaceHolder = useRef(null);
  const refCanvas = useRef(null);
  const refLoading = useRef(null);

  const [ismodalName, SetismodalName] = useState("rayban_aviator_or_vertFlash");
  const [isheight, Setisheight] = useState(500);
  const [iswidth, Setwidth] = useState(500);
  const [adjustMode, setAdjustMode] = useState(false);

  const toggleLoading = (isLoadingVisible) => {
    refLoading.current.style.display = isLoadingVisible ? "block" : "none";
  };

  const StartadjustMode = () => {
    JEELIZVTOWIDGET.enter_adjustMode();
    setAdjustMode(true);
  };

  const ExitadjustMode = () => {
    JEELIZVTOWIDGET.exit_adjustMode();
    setAdjustMode(false);
  };

  const SetglassesModel = (sku) => {
    JEELIZVTOWIDGET.load(sku);
  };

  useEffect(() => {
    const placeHolder = refPlaceHolder.current;
    const canvas = refCanvas.current;
    initWidget(placeHolder, canvas, toggleLoading);
    return () => {
      JEELIZVTOWIDGET.destroy();
    };
  }, []);

  useEffect(() => {
    SetismodalName(props.modelname);
  }, [props.modelname]);

  useEffect(() => {
    Setisheight(props.canvasheight);
  }, [props.canvasheight]);

  useEffect(() => {
    Setwidth(props.canvaswidth);
  }, [props.canvaswidth]);

  return (
    <div className={styles.JeelizVTOWidgetContainer}>
      <div ref={refPlaceHolder} className={styles.JeelizVTOWidget} style={{ height: isheight, width: iswidth }}>
        <canvas ref={refCanvas} className={styles.JeelizVTOWidgetCanvas} />
        <div ref={refLoading} className={styles.JeelizVTOWidgetLoading}>
          {/* <div className={styles.JeelizVTOWidgetLoadingText}>LOADING...</div> */}
        </div>
      </div>

      <div className={styles.JeelizVTOWidgetButtonContainer}>
        {adjustMode && (
          <div className={styles.JeelizVTOWidgetAdjustNoticeContainer}>
            {/* <div className={styles.JeelizVTOWidgetAdjustNotice}>
              Move the glasses to adjust them.
            </div> */}
            <div className={styles.JeelizVTOWidgetControls}>
              <ControlButton onClick={ExitadjustMode}>Exit</ControlButton>
            </div>
          </div>
        )}
        {!adjustMode && (
          <>
            <div className={styles.JeelizVTOWidgetControls}>
              <ControlButton onClick={StartadjustMode}>Adjust</ControlButton>
            </div>
            <div className={`${styles.JeelizVTOWidgetControls} ${styles.JeelizVTOWidgetChangeModelContainer}`}>
              <ControlButton onClick={() => SetglassesModel(ismodalName)}>Try Glasses</ControlButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GlassArView;
