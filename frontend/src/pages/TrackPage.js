import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 假设你有 fetchConcepts 这个 API
import { fetchConcepts } from "../services";
// You can import your original quiz/concept page here
// import QuizPage from "./QuizPage";

export default function TrackPage() {
  const { trackKey } = useParams();
  const navigate = useNavigate();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConcepts() {
      setLoading(true);
      try {
        const allConcepts = await fetchConcepts();
        console.log("allConcepts:", allConcepts);
        console.log("trackKey:", trackKey);
        const filtered = allConcepts.filter(c => c.track === trackKey);
        console.log("filtered:", filtered);
        setConcepts(filtered);
      } catch (e) {
        console.error("fetchConcepts error:", e);
        setConcepts([]);
      }
      setLoading(false);
    }
    loadConcepts();
  }, [trackKey]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: 32 }}>{trackKey.replace(/-/g, " ").toUpperCase()}</h2>
      <div className="concept-list">
        {concepts.map(concept => (
          <div
            key={concept._id}
            className="concept-card"
            onClick={() => navigate(`/concept/${concept._id}`)}
          >
            <h3>{concept.name}</h3>
            {concept.description && <p>{concept.description}</p>}
          </div>
        ))}
      </div>
      {/* Render your original UI for this track here */}
      {/* <QuizPage conceptIds={...} /> */}
    </div>
  );
}
