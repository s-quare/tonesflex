import { useState, useEffect } from "react";
import { TonesFlexContext } from "./TonesFlexContext";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import DOMPurify from 'dompurify';


export const TonesFlexProvider = ({ children }) => {
  const [mood, setMood] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [playlist, setPlaylist] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("tonesflex_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("tonesflex_history", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      offset: 0,
      easing: "ease-out",
    });
  }, []);

  const showToast = (text) => {
    Toastify({
      text: text,
      duration: 3000,
      gravity: "top",
      position: "center",
      style: {
        background: "rgba(25, 135, 84, 0.689)",
        color: "white",
        fontSize: "12px",
        fontWeight: 'bold',
        backdropFilter: 'blur(2px)'
      },
      
    }).showToast();
  };

  const cleanHTML = (element)=> {
    return DOMPurify.sanitize(element)
  }

  const value = {
    mood,
    setMood,
    questions,
    setQuestions,
    answers,
    setAnswers,
    playlist,
    setPlaylist,
    history,
    setHistory,
    showToast,
    refreshAOS: ()=>AOS.refresh(),
    cleanHTML
  };

  return (
    <TonesFlexContext.Provider value={value}>
      {children}
    </TonesFlexContext.Provider>
  );
};
