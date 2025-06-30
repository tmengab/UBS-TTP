const { calculateUserSummary, getAllTracksProgress } = require('./progressCalculator');

async function getAIResponse(userMessage, userContext = '') {
  // ... (The getAIResponse function using fetch and DeepSeek remains the same)
}

async function getUserContext(userId) {
  // ... (The getUserContext function remains the same)
}

module.exports = { getAIResponse, getUserContext };
