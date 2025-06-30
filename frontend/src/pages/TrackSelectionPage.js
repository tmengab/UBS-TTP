import React from "react";
import { useNavigate } from "react-router-dom";

const tracks = [
  { key: "basic", name: "Basic Programming" },
  { key: "data-science", name: "Data Science" },
  { key: "data-structures", name: "Data Structures" },
  { key: "full-stack", name: "Full Stack" },
];

export default function TrackSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="track-select-container">
      <h2>Choose Your Learning Track</h2>
      <div className="track-list">
        {tracks.map((track) => (
          <div
            key={track.key}
            className="track-card"
            onClick={() => navigate(`/track/${track.key}`)}
          >
            <h3>{track.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
} 