import React, { useState, useEffect, useCallback } from "react";
import { scenarios, randomShade, shuffleArray } from "./scenarios";
import ShadeMatcher from "./ShadeMatcher";
import "./index.css"; // ensure this has the Inter font import or fallback

export default function ShadeGame() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [variantKey, setVariantKey] = useState("X"); // initial variant
  const [redemption, setRedemption] = useState(50);
  const [attempts, setAttempts] = useState({ A: 3, B: 3, C: 3 });
  const [choice, setChoice] = useState(null);
  const [message, setMessage] = useState(null);
  const [locked, setLocked] = useState({ A: false, B: false, C: false });
  const [targetShade, setTargetShade] = useState(128);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const forgiveness = { A: 7, B: 14, C: 20 };
  const impacts = { A: 1.15, B: 0.95, C: 0.9 };

  const getVariantFromRedemption = (rate) => {
    if (rate >= 75) return "W";
    if (rate >= 50) return "X";
    if (rate >= 25) return "Y";
    return "Z";
  };

  const getInitialTargetShade = (scenario, selectedOption) => {
    if (selectedOption === "C") {
      const edge = Math.random() < 0.5 ? 0 : 255;
      const offset = Math.floor(Math.random() * 20);
      return edge === 0 ? edge + offset : edge - offset;
    }
    return randomShade();
  };

  const currentScenario = scenarios[scenarioIndex]?.variants[variantKey];

  const startMatch = useCallback((opt) => {
    if (!currentScenario) return;
    setChoice(opt);
    setTargetShade(getInitialTargetShade(currentScenario, opt));
    setMessage(null);
  }, [currentScenario]);

  // Shuffle options when scenario changes
  useEffect(() => {
    if (currentScenario?.options) {
      const optionsEntries = Object.entries(currentScenario.options);
      setShuffledOptions(shuffleArray([...optionsEntries]));
    }
  }, [currentScenario]);

  const handleMatchResult = (isMatch) => {
    if (!choice) return;
    if (isMatch) {
      setLocked({ A: true, B: true, C: true });
      setMessage("Matched! Click next to advance.");
      if (scenarioIndex < scenarios.length - 1) {
        setRedemption((r) => r * impacts[choice]);
      }
    } else {
      const remaining = attempts[choice] - 1;
      setAttempts((prev) => ({ ...prev, [choice]: remaining }));
      if (remaining <= 0) {
        setLocked((prev) => ({ ...prev, [choice]: true }));
        setChoice(null);
        setMessage("Failed all attempts for this option.");
      } else {
        setMessage("Not quite. Try again.");
      }
    }
  };

  const nextScenario = () => {
    const nextIndex = scenarioIndex + 1;
    setScenarioIndex(nextIndex);
    const nextVariant = getVariantFromRedemption(redemption);
    setVariantKey(nextVariant);

    setAttempts({ A: 3, B: 3, C: 3 });
    setLocked({ A: false, B: false, C: false });
    setChoice(null);
    setMessage(null);

    const nextScenarioObj = scenarios[nextIndex]?.variants[nextVariant];
    if (nextScenarioObj) setTargetShade(getInitialTargetShade(nextScenarioObj, null));
  };

  console.log("Choice", choice);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6" style={{ fontFamily: "'Inter', sans-serif", marginLeft: "1in", marginRight: "1in" }}>
      <h1 className="text-2xl font-bold">The Motherland Calls</h1>

      <h2 className="text-xl font-semibold">{currentScenario?.title}</h2>

      <div className="text-lg">
        {currentScenario?.body.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Options */}
      {currentScenario?.options &&
        Object.keys(currentScenario.options).length > 0 &&
        !message?.includes("Matched") && (
          <div className="flex flex-col space-y-2">
            {shuffledOptions
              .filter(([opt]) => !locked[opt])
              .map(([opt, text]) => (
              <button
                key={opt}
                className="p-2 bg-gray-200 rounded"
                onClick={() => startMatch(opt)}
                disabled={locked[opt]}
              >
                {text} {locked[opt] ? "(locked)" : ""}
              </button>
            ))}
          </div>
        )}

      {/* Matching UI */}
      {choice && <ShadeMatcher
        targetShade={targetShade}
        choice={choice}
        forgiveness={forgiveness}
        onMatch={handleMatchResult}
        key={choice} // Reset component when choice changes
      />}

      {/* Message & follow-up */}
      {message && (
        <div className="space-y-2">
          <div>{message}</div>
          {message.includes("Matched") && (
            <>
              <div>
                {currentScenario.followUp[choice]?.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <button onClick={nextScenario} className="p-2 bg-black text-white rounded">
                Next
              </button>
            </>
          )}
        </div>
      )}

      {/* <div>Redemption Rate: {Math.round(redemption)}</div>
      <div>Variant: {variantKey}</div> */}
    </div>
  );
}
