import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMaterials } from "../services"; // 你已有的API

export default function ConceptDetailPage() {
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMaterials() {
      setLoading(true);
      // 假设你有 fetchMaterials(conceptId, level)，这里查所有level
      let allMaterials = [];
      for (let level = 1; level <= 3; level++) {
        try {
          const mats = await fetchMaterials(conceptId, level);
          allMaterials = allMaterials.concat(mats);
        } catch (e) {}
      }
      setMaterials(allMaterials);
      setLoading(false);
    }
    loadMaterials();
  }, [conceptId]);

  if (loading) return <div>Loading materials...</div>;

  return (
    <div>
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: 32 }}>Learning Materials</h2>
      <div className="material-list">
        {materials.length === 0 ? (
          <div style={{ color: "#fff", textAlign: "center" }}>No materials found for this concept.</div>
        ) : (
          materials.map((m, i) => (
            <div className="material-card" key={i}>
              <h3 style={{ color: '#6c757d', fontWeight: 700, background: 'none', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset', backgroundClip: 'unset', textShadow: 'none', opacity: 1 }}>{m.title}</h3>
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2', fontWeight: "bold", fontSize: "1.1rem" }}
              >
                {m.title}
              </a>
              <div style={{ color: "#cfd8dc", marginTop: 8 }}>{m.mediaType}</div>
            </div>
          ))
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button
          className="quiz-btn"
          onClick={() => navigate(`/quiz/${conceptId}`)}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
