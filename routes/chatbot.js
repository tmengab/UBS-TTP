// 在文件顶部添加这行来调试
console.log('Environment variables check:');
console.log('DEEPSEEK_API_KEY exists:', !!process.env.DEEPSEEK_API_KEY);
console.log('DEEPSEEK_API_KEY length:', process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.length : 0);

const express = require('express');
const router = express.Router();
const Material = require('../models/Material'); // Make sure this is your Mongoose model
const Concept = require('../models/Concept');
const ChatbotLog = require('../models/Chatbotlog'); // Add this at the top
const AIQAPair = require('../models/AIQAPair'); // Add this for storing AI Q&A pairs
const { calculateUserSummary, getAllTracksProgress } = require('../utils/progressCalculator'); // 假设这个文件已存在
const DynamicLearning = require('../models/DynamicLearning');

// 新增：DeepSeek 配置 (使用 OpenAI SDK)
const OpenAI = require('openai');

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY, // 明确指定使用 DEEPSEEK_API_KEY
  dangerouslyAllowBrowser: true // 添加这个选项避免浏览器警告
});

// 在文件顶部添加这行来测试 API key 是否正确加载
console.log('DeepSeek API Key loaded:', process.env.DEEPSEEK_API_KEY ? 'Yes' : 'No');

console.log('chatbot.js loaded');

// --- AI Helper Functions (包含AI提示) ---
// 将这些函数直接放在这里，避免使用额外的文件

async function getAIResponse(userMessage, userContext = '') {
  try {
    const systemPrompt = `
    You are a highly specialized AI assistant for a tech learning platform.
    Your ONLY function is to answer questions directly related to the following topics:
    - Basic Programming (syntax, loops, functions, etc.)
    - Full-stack Development (HTML, CSS, JavaScript, Node.js, databases, etc.)
    - Data Science (Python, Pandas, Machine Learning, Data Cleaning, etc.)
    - AI Learning (Neural Networks, core AI concepts, etc.)
    - The learning platform itself (how to find materials, how quizzes work, etc.)

    IMPORTANT RULE: If the user's question is NOT about these specific tech topics, you MUST politely refuse to answer. Use one of the predefined refusal phrases.

    Refusal Phrases:
    - "My specialization is in tech learning. I can't provide information on that topic. How can I help you with programming or data science today?"
    - "I am an AI assistant focused on this learning platform and can't answer general knowledge questions."
    - "That question is outside of my scope. Let's focus on your tech learning journey."

    The user's learning context is: ${userContext}
    Now, analyze and answer the user's question based on these rules.
    `;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.5
      })
    });

    if (!response.ok) throw new Error(`DeepSeek API error: ${response.status}`);
    const data = await response.json();
    console.log('DeepSeek raw response:', data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again.";
  }
}

async function getUserContext(userId) {
  try {
    const summary = await calculateUserSummary(userId);
    let context = "User has not completed any levels yet.";
    if (summary && summary.achievements && summary.achievements.length > 0) {
      context = `User has completed ${summary.achievements.length} learning levels.`;
    }
    return context;
  } catch (error) {
    console.error('Error getting user context:', error);
    return 'Could not retrieve user context.';
  }
}

// Function to find similar questions
async function findSimilarQuestion(question, userId) {
  try {
    // First try exact match
    const exactMatch = await AIQAPair.findOne({ 
      question: question,
      userId: userId 
    }).sort({ createdAt: -1 });
    
    if (exactMatch) {
      return { qa: exactMatch, similarity: 'exact' };
    }
    
    // Then try text search for similar questions
    const similarQuestions = await AIQAPair.find({ 
      $text: { $search: question },
      userId: userId 
    }).sort({ createdAt: -1 }).limit(3);
    
    if (similarQuestions.length > 0) {
      // For now, return the most recent similar question
      // In the future, you could implement more sophisticated similarity scoring
      return { qa: similarQuestions[0], similarity: 'similar' };
    }
    
    return null;
  } catch (error) {
    console.error('Error finding similar question:', error);
    return null;
  }
}

// --- API Endpoints ---

// Main endpoint for initial user requests
router.post('/ask', async (req, res) => {
  const { message, userId } = req.body;
  
  // Handle pre-defined quick replies first
  switch (message) {
    case "Intro to this platform":
      reply = "This is an interactive platform designed to help you master key tech skills for today's fast-paced work environment. You can learn through concepts, quizzes, and recommended materials.";
      break;
    case "Learning Materials":
      reply = "You can find materials on each concept's detail page before starting a quiz. What topic are you interested in learning about today?";
      break;
    case "My Learning History": {
      const summary = await calculateUserSummary(userId);
      
      console.log('Result from calculateUserSummary:', JSON.stringify(summary, null, 2));

      if (summary.achievements && summary.achievements.length > 0) {
        reply = "Here are the levels you've completed so far:\n\n";
        reply += summary.achievements.map(ach => `✅ ${ach.trackName} - ${ach.conceptName} (Level ${ach.level})`).join('\n');
      } else {
        reply = "You haven't completed any levels yet. Keep learning to see your history grow!";
      }
      break;
    }
    case "My Certification": {
      console.log('Processing My Certification request for userId:', userId);
      
      const summary = await calculateUserSummary(userId);
      const trackProgress = await getAllTracksProgress(userId);
      
      console.log('Track progress:', JSON.stringify(trackProgress, null, 2));
      
      let certReply = "";
      
      // 显示奖牌
      if (summary.medal) {
        certReply += `Congratulations! You've earned the ${summary.medal.name} award.\n\n`;
      } else {
        certReply += "You haven't earned a medal yet. Complete more levels to get your first award!\n\n";
      }
      
      // 检查每个 track 的完成情况
      const completedTracks = [];
      const inProgressTracks = [];
      
      for (const [trackKey, progress] of Object.entries(trackProgress)) {
        const trackDisplayName = trackKey.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        
        console.log(`Track ${trackKey}:`, progress);
        
        if (progress.isComplete) {
          completedTracks.push(trackDisplayName);
        } else if (progress.completedConcepts > 0) {
          inProgressTracks.push({
            name: trackDisplayName,
            completed: progress.completedConcepts,
            total: progress.totalConcepts
          });
        }
      }
      
      console.log('Completed tracks:', completedTracks);
      console.log('In progress tracks:', inProgressTracks);
      
      // 显示已完成的 tracks
      if (completedTracks.length > 0) {
        certReply += "🎓 You have earned Master Certifications for these tracks:\n";
        certReply += completedTracks.map(track => `   • ${track} Master`).join('\n');
        certReply += "\n";
      }
      
      // 显示进行中的 tracks
      if (inProgressTracks.length > 0) {
        certReply += " Tracks in progress:\n";
        for (const track of inProgressTracks) {
          certReply += `   • ${track.name}: ${track.completed}/${track.total} concepts completed\n`;
        }
        certReply += "\n";
        
        // 推荐优先完成的 track
        const mostProgressTrack = inProgressTracks.reduce((prev, current) => 
          (current.completed / current.total) > (prev.completed / prev.total) ? current : prev
        );
        
        const progressPercentage = Math.round((mostProgressTrack.completed / mostProgressTrack.total) * 100);
        certReply += ` You can prioritize finishing ${mostProgressTrack.name} track to get a ${mostProgressTrack.name} Master Certification! (${progressPercentage}% complete)`;
      }
      
      if (completedTracks.length === 0 && inProgressTracks.length === 0) {
        certReply += "You have no certifications yet. Start learning to earn your first Master Certification!";
      }
      
      reply = certReply;
      break;
    }
    case "New Learning Track Creation":
      reply = "Great! I can help you create a custom learning track on any topic you're interested in. What would you like to learn about? Just tell me the topic (e.g., 'React Hooks', 'Machine Learning Basics', 'Docker Containers') and I'll generate questions and learning materials for you.";
      break;
    default:
      // --- New Internal Search Logic ---
      const lowerCaseMessage = message.toLowerCase();
      const stopWords = new Set(["give", "me", "some", "about", "for", "a", "an", "the", "of", "to", "with", "on", "in", "is", "are", "do", "you"]);
      
      let needsAIFallback = false;

      const hasMaterialKeyword = lowerCaseMessage.includes('material');
      const hasQuizKeyword = lowerCaseMessage.includes('quiz') || lowerCaseMessage.includes('question') || lowerCaseMessage.includes('problem');

      // Filter out trigger words and stop words to get search terms
      const keywords = lowerCaseMessage.split(/\s+/)
        .filter(word => !stopWords.has(word) && !word.includes('material') && !word.includes('quiz') && !word.includes('question') && !word.includes('problem'));

      if (hasMaterialKeyword) {
        const foundMaterials = await Material.find({ $text: { $search: keywords.join(' ') } });
        if (foundMaterials.length > 0) {
          reply = "Here are some materials I found for you:\n" + 
            foundMaterials.map(m => `• ${m.title}: ${m.url}`).join('\n');
        } else {
          needsAIFallback = true;
        }
      } else if (hasQuizKeyword) {
        const foundConcepts = await Concept.find({ $text: { $search: keywords.join(' ') } });
         if (foundConcepts.length > 0) {
            reply = "You can find quizzes on these topics. Please navigate to the concept page to start:\n" +
                foundConcepts.map(c => `• ${c.name}: /track/${c.track}`).join('\n');
        } else {
            needsAIFallback = true;
        }
      } else {
        needsAIFallback = true;
      }

      if (needsAIFallback) {
        // Before triggering AI, check if we already have an answer in our AI Q&A database
        const existingQA = await findSimilarQuestion(message, userId);
        
        if (existingQA) {
          console.log(`Found ${existingQA.similarity} answer for question:`, message);
          await ChatbotLog.create({ message, reply: existingQA.qa.answer, userId, usedAI: true });
          return res.json({ 
            reply: existingQA.qa.answer, 
            usedAI: true,
            fromCache: true,
            similarity: existingQA.similarity
          });
        }
        
        // If no existing answer found, then trigger AI
        await ChatbotLog.create({ message, reply: "AI Fallback Triggered", userId });
        return res.json({
          preliminaryReply: "Interesting! I'll get more details soon...",
          triggerAI: true
        });
      }
  }

  // If internal search was successful
  await ChatbotLog.create({ message, reply, userId });
  res.json({ reply, usedAI: false });
});

// New dedicated endpoint for AI-only queries
router.post('/ai-query', async (req, res) => {
    const { message, userId } = req.body;
    
    // First, check if we already have an answer for this question or similar questions
    const existingQA = await findSimilarQuestion(message, userId);
    
    if (existingQA) {
        console.log(`Found ${existingQA.similarity} answer for question:`, message);
        await ChatbotLog.create({ message, reply: existingQA.qa.answer, userId, usedAI: true });
        return res.json({ 
            reply: existingQA.qa.answer, 
            usedAI: true,
            fromCache: true,
            similarity: existingQA.similarity
        });
    }
    
    // If no existing answer found, call AI API
    const userContext = await getUserContext(userId);
    const aiReply = await getAIResponse(message, userContext);
    
    // Save the Q&A pair to database
    try {
        await AIQAPair.create({
            userId: userId,
            question: message,
            answer: aiReply,
            aiProvider: 'DeepSeek'
        });
        console.log('AI Q&A pair saved to database');
    } catch (error) {
        console.error('Error saving AI Q&A pair:', error);
    }
    
    await ChatbotLog.create({ message, reply: aiReply, userId, usedAI: true });
    res.json({ reply: aiReply, usedAI: true, fromCache: false });
});

// GET /api/chatbot/logs - View all chatbot logs, sorted by latest first
router.get('/logs', async (req, res) => {
  try {
    const logs = await ChatbotLog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/chatbot/ai-qa - View all AI Q&A pairs, sorted by latest first
router.get('/ai-qa', async (req, res) => {
  try {
    const { userId, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    const qaPairs = await AIQAPair.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AIQAPair.countDocuments(query);
    
    res.json({ 
      success: true, 
      data: qaPairs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/chatbot/ai-qa/search - Search AI Q&A pairs by question content
router.get('/ai-qa/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    
    const qaPairs = await AIQAPair.find({ $text: { $search: q } })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: qaPairs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/chatbot/ai-qa/user/:userId - Get Q&A history for a specific user
router.get('/ai-qa/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const qaPairs = await AIQAPair.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AIQAPair.countDocuments({ userId });
    
    res.json({ 
      success: true, 
      data: qaPairs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/chatbot/create-learning-track - Create a new dynamic learning track
router.post('/create-learning-track', async (req, res) => {
  console.log('==== /create-learning-track called ====', req.body);
  try {
    const { topic, userId } = req.body;
    
    if (!topic || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Topic and userId are required' 
      });
    }

    // Check if user already has a learning track for this topic
    const existingTrack = await DynamicLearning.findOne({ 
      userId, 
      topic: { $regex: new RegExp(topic, 'i') },
      status: { $in: ['created', 'in_progress'] }
    });

    if (existingTrack) {
      return res.json({
        success: true,
        message: `You already have a learning track for "${topic}". Would you like to continue with that one or create a new one?`,
        existingTrackId: existingTrack._id,
        hasExisting: true
      });
    }

    // DeepSeek prompt
    const prompt = `
    Create a learning module for the topic: "${topic}"

    You MUST respond with ONLY valid JSON, no other text or formatting.

    Please provide:
    1. 5 multiple choice questions (each with 4 options, A-D)
    2. 3-5 learning materials (articles, videos, tutorials)

    Response format (JSON only):
    {
      "questions": [
        {
          "questionText": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation of why this is correct"
        }
      ],
      "materials": [
        {
          "title": "Material title",
          "url": "https://example.com",
          "description": "Brief description",
          "type": "article"
        }
      ]
    }
    IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or additional text.
    `;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are an expert educational content creator. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('DeepSeek raw response:', data.choices[0].message.content);
    let content;
    try {
      content = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      const cleanedContent = data.choices[0].message.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      content = JSON.parse(cleanedContent);
    }
    console.log('Parsed questions:', JSON.stringify(content.questions, null, 2));

    // Create the dynamic learning track
    const learningTrack = await DynamicLearning.create({
      userId,
      topic,
      questions: content.questions,
      materials: content.materials,
      totalQuestions: content.questions.length,
      status: 'created'
    });

    res.json({
      success: true,
      message: `Great! I've created a learning track for "${topic}" with ${content.questions.length} questions and ${content.materials.length} learning materials. Would you like to start the quiz now?`,
      trackId: learningTrack._id,
      questionCount: content.questions.length,
      materialCount: content.materials.length
    });

  } catch (error) {
    console.error('Error creating learning track:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create learning track. Please try again.' 
    });
  }
});

// GET /api/chatbot/learning-track/:trackId
router.get('/learning-track/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const { userId } = req.query;
    const track = await DynamicLearning.findOne({ _id: trackId, userId });
    if (!track) {
      return res.status(404).json({ success: false, error: 'Learning track not found' });
    }
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch learning track' });
  }
});

// POST /api/chatbot/answer-question
router.post('/answer-question', async (req, res) => {
  console.log('==== /answer-question called ====');
  console.log('Request body:', req.body);
  console.log('Request query:', req.query);
  console.log('userId from query:', req.query.userId);
  
  try {
    const { trackId, questionIndex, userAnswer } = req.body;
    const { userId } = req.query;
    
    console.log('Extracted data:', { trackId, questionIndex, userAnswer, userId });
    
    if (!userId) {
      console.log('No userId provided');
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    
    if (!trackId) {
      console.log('No trackId provided');
      return res.status(400).json({ success: false, error: 'trackId is required' });
    }
    
    const track = await DynamicLearning.findOne({ _id: trackId, userId });
    console.log('Found track:', track ? 'Yes' : 'No');
    
    if (!track) {
      return res.status(404).json({ success: false, error: 'Learning track not found' });
    }
    if (questionIndex >= track.questions.length) {
      return res.status(400).json({ success: false, error: 'Invalid question index' });
    }
    const question = track.questions[questionIndex];
    const isCorrect = userAnswer === question.correctAnswer;
    question.userAnswer = userAnswer;
    question.isCorrect = isCorrect;
    question.answered = true;
    if (isCorrect) track.score += 1;
    const allAnswered = track.questions.every(q => q.answered);
    if (allAnswered) {
      track.status = 'completed';
      track.completedAt = new Date();
    } else {
      track.status = 'in_progress';
    }
    await track.save();
    res.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      score: track.score,
      totalQuestions: track.totalQuestions,
      completed: allAnswered,
      nextQuestionIndex: allAnswered ? null : questionIndex + 1
    });
  } catch (error) {
    console.error('Error in answer-question:', error);
    res.status(500).json({ success: false, error: 'Failed to submit answer' });
  }
});

// GET /api/chatbot/user-learning-tracks/:userId
router.get('/user-learning-tracks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    let query = { userId };
    if (status) query.status = status;
    const tracks = await DynamicLearning.find(query)
      .sort({ createdAt: -1 })
      .select('topic status score totalQuestions createdAt completedAt');
    res.json({ success: true, data: tracks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch learning tracks' });
  }
});

module.exports = router;
