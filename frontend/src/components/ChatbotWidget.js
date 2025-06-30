import React, { useState, useEffect, useRef } from "react";
import DynamicLearningQuiz from "./DynamicLearningQuiz";

export default function ChatbotWidget() {
  // 1. Get the username and userId from localStorage
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  // 2. Create the personalized welcome message
  const welcomeMessage = "Welcome! Ask me for 'materials on python' or 'quiz on data structures'.";

  // 3. Set the initial state with the dynamic message
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: welcomeMessage }]);
  const [input, setInput] = useState("");
  const [creatingTrack, setCreatingTrack] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedTrack, setCompletedTrack] = useState(null);
  
  const chatContainerRef = useRef(null);

  const suggestionChips = [
    "Intro to this platform",
    "Learning Materials",
    "My Learning History",
    "My Certification",
    "New Learning Track Creation"
  ];

  // 3. 使用 useEffect，在 messages 数组更新时自动滚动
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 添加CSS样式
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .chatbot-scrollbar::-webkit-scrollbar-track {
        background: #e3f2fd;
        border-radius: 3px;
      }
      .chatbot-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 3px;
      }
      .chatbot-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      }
      
      .chatbot-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      
      .chatbot-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
      
      .chatbot-card {
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
        border: 1px solid rgba(102, 126, 234, 0.1);
      }
      
      .chatbot-input {
        border: 2px solid #e9ecef;
        border-radius: 12px;
        transition: all 0.3s ease;
        color: #495057;
      }
      
      .chatbot-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      
      .chatbot-send-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .chatbot-send-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
      
      .chatbot-chip {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 20px;
        color: #495057;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .chatbot-chip:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      }
      
      .bot-message, .ai-message {
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        color: #1976d2;
        border: 1px solid #bbdefb;
      }
      .user-message {
        background: #fff;
        color: #495057;
        border: 1px solid #e9ecef;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 统一的消息处理函数
  async function handleSendMessage(text) {
    if (!text.trim()) return;

    const userMessage = { from: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    if (input) setInput(""); // 清空输入框

    try {
      // 检查是否正在创建学习轨道
      if (creatingTrack) {
        await createLearningTrack(text);
        return;
      }

      // 检查是否是开始测验的命令
      if (text.toLowerCase() === 'start quiz' && currentTrackId) {
        setShowQuiz(true);
        setMessages(prev => [...prev, { from: 'bot', text: "Great! Let's start the quiz.", isAI: false }]);
        return;
      }

      // 第一步：调用/ask端点进行逻辑分发
      const initialRes = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId: userId })
      });
      const initialData = await initialRes.json();

      if (initialData.reply) {
        // 情况1：内部搜索直接返回了答案，或者从AI缓存返回了答案
        const isAI = initialData.usedAI || initialData.fromCache;
        setMessages(prev => [...prev, { from: 'bot', text: initialData.reply, isAI: isAI }]);
        
        // 检查是否是学习轨道创建的回复
        if (initialData.reply.includes("What would you like to learn about?")) {
          setCreatingTrack(true);
        }
      } else if (initialData.triggerAI) {
        // 情况2：需要调用AI API
        // a) 首先显示提示消息
        setMessages(prev => [...prev, { from: 'bot', text: initialData.preliminaryReply, isAI: false }]);

        // b) 然后调用专用的/ai-query端点
        const aiRes = await fetch("/api/chatbot/ai-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, userId: userId })
        });
        const aiData = await aiRes.json();
        
        // c) 最后显示AI的回答
        setMessages(prev => [...prev, { from: 'bot', text: aiData.reply, isAI: true }]);
      }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { from: 'bot', text: "Sorry, an error occurred.", isAI: false }]);
    }
  }

  // 创建学习轨道的函数
  async function createLearningTrack(topic) {
    try {
      setCreatingTrack(false);
      
      const response = await fetch("/api/chatbot/create-learning-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { from: 'bot', text: data.message, isAI: false }]);
        
        if (data.trackId) {
          setCurrentTrackId(data.trackId);
          
          // 添加开始测验的选项
          setMessages(prev => [...prev, { 
            from: 'bot', 
            text: "Would you like to start the quiz now? Type 'yes' to begin or 'no' to view materials first.",
            isAI: false,
            showQuizOptions: true
          }]);
        }
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: data.error, isAI: false }]);
      }
    } catch (error) {
      console.error("Error creating learning track:", error);
      setMessages(prev => [...prev, { from: 'bot', text: "Failed to create learning track. Please try again.", isAI: false }]);
    }
  }

  // 处理测验选项
  function handleQuizOption(option) {
    if (option === 'yes') {
      setShowQuiz(true);
      setMessages(prev => [...prev, { from: 'user', text: 'yes' }]);
      setMessages(prev => [...prev, { from: 'bot', text: "Great! Let's start the quiz.", isAI: false }]);
    } else if (option === 'no') {
      // 显示学习材料
      showLearningMaterials();
    }
  }

  // 显示学习材料
  async function showLearningMaterials() {
    try {
      const response = await fetch(`/api/chatbot/learning-track/${currentTrackId}?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        const materials = data.data.materials;
        const materialsText = "Here are the learning materials for you:\n\n" + 
          materials.map((m, i) => `${i + 1}. ${m.title}\n   ${m.description}\n   ${m.url}`).join('\n\n');
        
        setMessages(prev => [...prev, { from: 'bot', text: materialsText, isAI: false }]);
        setMessages(prev => [...prev, { from: 'bot', text: "When you're ready, type 'start quiz' to begin the quiz.", isAI: false }]);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  }

  // 处理测验完成
  function handleQuizComplete(track) {
    setShowQuiz(false);
    setCompletedTrack(track);
    
    const scorePercentage = Math.round((track.score / track.totalQuestions) * 100);
    const completionMessage = `🎉 Quiz completed! You scored ${track.score}/${track.totalQuestions} (${scorePercentage}%).\n\n`;
    
    const materialsText = "Here are the learning materials for further study:\n\n" + 
      track.materials.map((m, i) => `${i + 1}. ${m.title}\n   ${m.description}\n   ${m.url}`).join('\n\n');
    
    setMessages(prev => [...prev, { from: 'bot', text: completionMessage + materialsText, isAI: false }]);
  }

  // 处理测验关闭
  function handleQuizClose() {
    setShowQuiz(false);
    setCurrentTrackId(null);
    setCompletedTrack(null);
  }

  // 只保留这一个函数用于快捷按钮
  function handleSuggestionClick(text) {
    handleSendMessage(text); // 只调用一次
  }

  // 输入框的发送
  function sendMessage() {
    handleSendMessage(input);
  }

  // 计算chatbot的尺寸
  const getChatbotDimensions = () => {
    if (expanded) {
      return {
        width: window.innerWidth < 768 ? '90vw' : '600px',
        height: '500px',
        maxHeight: '400px',
        bottom: window.innerWidth < 768 ? '20px' : '100px',
        right: window.innerWidth < 768 ? '5vw' : '32px'
      };
    } else {
      return {
        width: '320px',
        height: 'auto',
        maxHeight: '240px',
        bottom: '100px',
        right: '32px'
      };
    }
  };

  const dimensions = getChatbotDimensions();

  // 计算聊天统计
  const chatStats = {
    totalMessages: messages.length,
    userMessages: messages.filter(m => m.from === 'user').length,
    botMessages: messages.filter(m => m.from === 'bot').length,
    aiMessages: messages.filter(m => m.isAI).length
  };

  return (
    <div>
      <button
        className="chatbot-button"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 9999,
          width: 56,
          height: 56,
          fontSize: 28
        }}
        onClick={() => setOpen(o => !o)}
      >
        🗣️
      </button>
      
      {/* 动态学习测验组件 */}
      {showQuiz && currentTrackId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <DynamicLearningQuiz
            trackId={currentTrackId}
            onClose={handleQuizClose}
            onComplete={handleQuizComplete}
          />
        </div>
      )}
      
      {open && (
        <div
          className="chatbot-card"
          style={{
            position: "fixed",
            bottom: dimensions.bottom,
            right: dimensions.right,
            width: dimensions.width,
            padding: 20,
            zIndex: 9999,
            transition: "all 0.3s ease"
          }}
        >
          {/* Header with expand/collapse button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: '2px solid #e3f2fd'
          }}>
            <div>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '18px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                AI Learning Assistant
              </span>
              {expanded && (
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  {chatStats.totalMessages} messages • {chatStats.aiMessages} AI responses
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {expanded ? '🔽 Collapse' : '🔼 Expand'}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  color: '#6c757d',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#e9ecef'}
                onMouseOut={(e) => e.target.style.background = '#f8f9fa'}
              >
                ✕
              </button>
            </div>
          </div>

          <div 
            ref={chatContainerRef} 
            className="chatbot-scrollbar"
            style={{ 
              maxHeight: dimensions.maxHeight, 
              overflowY: "auto", 
              marginBottom: 16, 
              paddingRight: '8px'
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  margin: "12px 0"
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {msg.from === "bot" && msg.isAI && (
                    <span style={{ fontSize: '14px', color: '#667eea' }}>🤖</span>
                  )}
                  <span
                    className={msg.from === "user" ? "user-message" : msg.isAI ? "ai-message" : "bot-message"}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 18,
                      display: "inline-block",
                      maxWidth: "85%",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
                
                {/* 显示测验选项 */}
                {msg.showQuizOptions && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleQuizOption('yes')}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Yes, start quiz
                    </button>
                    <button
                      onClick={() => handleQuizOption('no')}
                      style={{
                        background: '#f8f9fa',
                        color: '#495057',
                        border: '1px solid #e9ecef',
                        borderRadius: '16px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      No, show materials
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 16 }}>
              {suggestionChips.map((chip, i) => (
                  <button
                      key={i}
                      className="chatbot-chip"
                      onClick={() => handleSuggestionClick(chip)}
                      style={{
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: '500'
                      }}
                  >
                      {chip}
                  </button>
              ))}
          </div>
          <div style={{ display: "flex", gap: '12px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="chatbot-input"
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '14px'
              }}
              placeholder="Ask me anything about tech learning..."
            />
            <button
              className="chatbot-send-btn"
              onClick={() => handleSendMessage(input)}
              style={{
                padding: "12px 20px",
                fontSize: '14px',
                fontWeight: '500'
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
