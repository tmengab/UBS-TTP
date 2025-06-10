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