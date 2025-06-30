// 用户相关 API 封装

export async function loginUser({ username, password }) {
  const res = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function registerUser({ username, email, password }) {
  const res = await fetch('/api/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

// 获取所有知识点
export async function fetchConcepts() {
  const res = await fetch('/api/concepts');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch concepts');
  return data.data;
}

// 获取下一个题目
export async function fetchNextQuestion(userId, conceptId) {
  const res = await fetch(`/api/questions/next/${userId}/${conceptId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch next question');
  return data.data;
}

// 提交答案
export async function submitAnswer({ userId, questionId, userAnswer }) {
  console.log('submitAnswer 参数:', { userId, questionId, userAnswer });
  const res = await fetch('/api/questions/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questionId, userAnswer })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit answer');
  return data.data;
}

// 获取学习材料
export async function fetchMaterials(conceptId, level) {
  const res = await fetch(`/api/materials/${conceptId}/${level}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch materials');
  return data.data;
}

// 获取用户进度
export async function fetchUserProgress(userId) {
  const res = await fetch(`/api/progress/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch progress');
  return data.data;
}

export async function createLearningTrack(topic, userId) {
  return fetch("/api/chatbot/create-learning-track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, userId })
  });
} 