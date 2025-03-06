import React, { useEffect, useState, useRef } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { VscDebugStart } from "react-icons/vsc";
import { CiPause1 } from "react-icons/ci";
import { RiResetLeftFill } from "react-icons/ri";

function numberToClock(number) {
  const minutes = Math.floor(number / 60);
  const seconds = number % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function App() {
  const focusDuration = 20 * 60;
  const breakDuration = 5 * 60;

  // Load from localStorage or default values
  const storedData = JSON.parse(localStorage.getItem("time")) || {
    time: focusDuration,
    focus: true,
  };
  const [time, setTime] = useState(storedData.time);
  const focus = useRef(storedData.focus);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      const id = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const resetTimer = () => {
    setTime(focus.current ? focusDuration : breakDuration);
  };

  const resetSession = () => {
    focus.current = true;
    setTime(focusDuration);
    clearInterval(intervalId);
    setIntervalId(null);
  };

  useEffect(() => {
    if (time === 0) {
      focus.current = !focus.current;
      setTime(focus.current ? focusDuration : breakDuration);
    }
  }, [time]);

  // Save the time to localStorage before leaving
  useEffect(() => {
    const saveTime = () => {
      localStorage.setItem(
        "time",
        JSON.stringify({ time, focus: focus.current })
      );
    };

    window.addEventListener("beforeunload", saveTime);
    return () => window.removeEventListener("beforeunload", saveTime);
  }, [time]);

  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="text-white text-4xl">
        {focus.current ? "Focus" : "Break"}
      </h1>
      <div className="w-[300px] flex justify-center items-center">
        <CircularProgressbar
          value={(time / (focus.current ? focusDuration : breakDuration)) * 100}
          text={numberToClock(time)}
        />
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={startTimer}
          className="text-white text-4xl hover:text-blue-400"
        >
          {intervalId ? <CiPause1 /> : <VscDebugStart />}
        </button>
        <button
          onClick={resetTimer}
          className="text-white text-4xl hover:text-blue-400"
        >
          <RiResetLeftFill />
        </button>
      </div>
      <button onClick={resetSession} className="bg-blue-600 px-4 py-2 rounded">
        Reset Session
      </button>
    </div>
  );
}
