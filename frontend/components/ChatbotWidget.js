import React, { useState } from "react";

export default function ChatbotWidget() {
  console.log('ChatbotWidget trying to get userId:', localStorage.getItem('userId'));

  const username = localStorage.getItem('username');
  const welcomeMessage = username ? `Welcome ${username}, what would you like to ask?` : "Welcome! What would you like to ask?";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: welcomeMessage }]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState([]);

  const suggestionChips = [
    "Intro to this platform",
    "Learning Materials",
    "My Learning History",
    "My Certification"
  ];

  async function handleRequest(messageToSend) {
    const userId = localStorage.getItem('userId');

    console.log('Sending to chatbot API:', { message: messageToSend, userId: userId });

    try {
      const res = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, userId: userId })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages(prev => [...prev, { from: "bot", text: "Sorry, I'm having trouble connecting." }]);
    }
  }

  async function handleSuggestionClick(text) {
    handleRequest(text);
  }

  function handleSendMessage() {
    if (!input.trim()) return;
    handleRequest(input);
    setInput("");
  }

  return (
    <div>
      <button
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 9999,
          background: "#1a237e",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
        onClick={() => setOpen(o => !o)}
      >
        💬
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 32,
            width: 320,
            background: "#1a237e",
            color: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            padding: 16,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ maxHeight: 240, overflowY: "auto", marginBottom: 8, flexGrow: 1, paddingRight: '5px' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  margin: "8px 0",
                  wordBreak: 'break-word'
                }}
              >
                <span
                  style={{
                    background: msg.from === "user" ? "#3949ab" : "#283593",
                    padding: "6px 12px",
                    borderRadius: 12,
                    display: "inline-block",
                    maxWidth: "90%"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px", borderTop: "1px solid #283593", paddingTop: "12px" }}>
            {suggestionChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(chip)}
                style={{
                  background: "#3949ab",
                  color: "#fff",
                  border: "1px solid #5c6bc0",
                  borderRadius: "16px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                {chip}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: "16px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage()}
              style={{
                flex: 1,
                borderRadius: 8,
                border: "none",
                padding: 8,
                marginRight: 8
              }}
              placeholder="Type your question..."
            />
            <button
              onClick={handleSendMessage}
              style={{
                background: "#3949ab",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
