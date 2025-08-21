// hooks/useDynamicHeight.js
import { useState, useEffect } from "react";

export const useDynamicHeight = ({
  headerSelector = ".ss_new_hed",
  appHeaderSelector = ".app-header",
  offset = 46,
  additionalGap = 13,
} = {}) => {
  const [height, setHeight] = useState(0);
  const [appHeaderHeight, setAppHeaderHeight] = useState(0);
  const [remainingHeight, setRemainingHeight] = useState(0);

  useEffect(() => {
    const calculateHeights = () => {
      const headerEl = document.querySelector(headerSelector);
      const appHeaderEl = document.querySelector(appHeaderSelector);

      const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const appHeaderH = appHeaderEl ? appHeaderEl.getBoundingClientRect().height : 0;

      setHeight(headerH);
      setAppHeaderHeight(appHeaderH);

      const availableHeight = window.innerHeight - (headerH + appHeaderH - additionalGap);
      setRemainingHeight(availableHeight - offset);
    };

    calculateHeights();

    window.addEventListener("resize", calculateHeights);
    return () => window.removeEventListener("resize", calculateHeights);
  }, [headerSelector, appHeaderSelector, offset, additionalGap]);

  return { height, appHeaderHeight, remainingHeight };
};
