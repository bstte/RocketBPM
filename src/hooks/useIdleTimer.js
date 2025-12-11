import { useEffect } from "react";

export default function useIdleTimer(onIdle, timeout = 10 * 60 * 1000) {
  let timer;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(onIdle, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timer);
    };
  }, []);
}
