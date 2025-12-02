import React, { useState } from "react";

export default function ShadeMatcher({ targetShade, choice, forgiveness, onMatch }) {
  const [matchValue, setMatchValue] = useState(128);

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const update = (clientX) => {
      let x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setMatchValue(Math.round((x / rect.width) * 255));
    };
    update(e.clientX);
    const move = (ev) => update(ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleSubmit = () => {
    if (!choice) return;
    const diff = Math.abs(matchValue - targetShade);
    onMatch(diff <= forgiveness[choice]);
  };

  if (!choice) return null;

  return (
    <div className="space-y-4 p-4 border rounded">
      <div
        className="w-24 h-24 mx-auto rounded-full"
        style={{ backgroundColor: `rgb(${targetShade},${targetShade},${targetShade})` }}
      />
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-full h-8 rounded bg-gradient-to-r from-black to-white relative cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute top-0 h-full w-1 bg-white"
            style={{ left: `${(matchValue / 255) * 100}%` }}
          />
        </div>
        <div
          className="w-10 h-10 rounded-full border"
          style={{ backgroundColor: `rgb(${matchValue},${matchValue},${matchValue})` }}
        />
      </div>
      <div className="flex justify-center">
        <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded">
          Submit Match
        </button>
      </div>
    </div>
  );
}

