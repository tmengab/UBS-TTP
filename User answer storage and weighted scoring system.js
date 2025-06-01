// OpenAI API
const OPENAI_API_KEY = 'api-key'; 

// 用户数据存储
const UserData = {
    // 保存当前测试会话
    currentSession: null,
    
    // 初始化
    init() {
        this.loadSessions();
        return this;
    },
    
    // 加载历史数据
    loadSessions() {
        this.sessions = JSON.parse(localStorage.getItem('assessmentSessions')) || [];
    },
    
    // 开始新会话
    startNewSession(track) {
        this.currentSession = {
            id: Date.now().toString(),
            track,
            startTime: new Date().toISOString(),
            answers: [],
            score: 0,
            concepts: []
        };
        return this.currentSession;
    },
    
    recordAnswer(questionId, selectedOption, isCorrect) {
        this.currentSession.answers.push({
            questionId,
            selectedOption,
            isCorrect,
            timestamp: new Date().toISOString()
        });
        this.saveSession();
    },
    
    // 计算加权分数
    calculateWeightedScore(questions) {
        let totalWeight = 0;
        let earnedWeight = 0;
        
        questions.forEach((q, index) => {
            totalWeight += q.weight;
            if (this.currentSession.answers[index]?.isCorrect) {
                earnedWeight += q.weight;
            }
        });
        
        this.currentSession.score = (earnedWeight / totalWeight) * 100;
        return this.currentSession.score;
    },
    
    
    saveSession() {
        if (this.currentSession) {
            // 更新现有会话或添加新会话
            const index = this.sessions.findIndex(s => s.id === this.currentSession.id);
            if (index >= 0) {
                this.sessions[index] = this.currentSession;
            } else {
                this.sessions.push(this.currentSession);
            }
            localStorage.setItem('assessmentSessions', JSON.stringify(this.sessions));
        }
    }
}.init();

// LLM服务
const LLMService = {
    // 分析错误题目提取关键词
    async analyzeWeakConcepts(wrongQuestions) {
        const prompt = `Analyze these programming questions the user answered incorrectly and:
1. Identify 2-3 core concepts they're struggling with
2. For each concept, provide:
   - A keyword for video search
   - A difficulty level (beginner/intermediate/advanced)
   
Format as JSON: {
  "concepts": [
    {
      "name": "loops",
      "searchQuery": "Python loops tutorial",
      "difficulty": "beginner"
    }
  ]
}

Questions:\n${wrongQuestions.map(q => q.question).join('\n')}`;

        try {
            const response = await this._callLLM(prompt);
            return response.concepts || [];
        } catch (error) {
            console.error("LLM分析失败:", error);
            return [];
        }
    },
    
    // 生成视频搜索查询
    async generateVideoQueries(concepts) {
        const prompt = `Generate 3 YouTube search queries for each programming concept to find tutorial videos.
For each concept, consider:
- The user's difficulty level
- Practical examples
- Common mistakes

Concepts:\n${concepts.map(c => `${c.name} (${c.difficulty})`).join('\n')}

Format as JSON: {
  "queries": [
    "Python for loops beginner tutorial",
    "How to fix common loop errors"
  ]
}`;

        try {
            const response = await this._callLLM(prompt);
            return response.queries || [];
        } catch (error) {
            console.error("LLM error:", error);
            return [];
        }
    },
    
    // 调用LLM API
    async _callLLM(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    }
};

// YouTube
const YouTubeService = {
    async searchVideos(query) {
        // 实际项目中使用YouTube API
        // 模拟实现
        const mockVideos = {
            "Python loops tutorial": [
                {
                    title: "Python Loops Tutorial for Beginners",
                    url: "https://youtube.com/watch?v=python-loops",
                    thumbnail: "https://i.ytimg.com/vi/python-loops/hqdefault.jpg",
                    duration: "12:34",
                    channel: "Python Tutorials"
                }
            ]
        };
        
        return mockVideos[query] || [];
    }
};

// 整合到现有系统
let currentTrack = '';
let currentQuestionIndex = 0;
let questions = [];

async function startQuiz(track) {
    currentTrack = track;
    questions = questionBank[track];
    currentQuestionIndex = 0;
    
    // 初始化用户会话
    UserData.startNewSession(track);
    
    document.getElementById('quiz-title').textContent = `${track} Assessment`;
    document.querySelector('.track-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    
    let optionsHtml = question.options.map((opt, i) => `
        <div class="option">
            <input type="radio" id="opt-${i}" name="answer" value="${i}">
            <label for="opt-${i}">${opt}</label>
        </div>
    `).join('');
    
    document.getElementById('question-container').innerHTML = `
        <div class="question">
            <h3>Question ${currentQuestionIndex + 1}: ${question.question}</h3>
            <div class="options">${optionsHtml}</div>
        </div>
    `;
}

async function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return alert('Please select an answer');
    
    const answerIndex = parseInt(selected.value);
    const isCorrect = answerIndex === questions[currentQuestionIndex].answer;
    
    // 记录用户答案
    UserData.recordAnswer(
        currentQuestionIndex, 
        answerIndex, 
        isCorrect
    );
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        await showResults();
    }
}

async function showResults() {
    // 计算分数
    const score = UserData.calculateWeightedScore(questions);
    
    // 获取错误题目
    const wrongQuestions = questions.filter((q, i) => {
        return !UserData.currentSession.answers[i]?.isCorrect;
    });
    
    // 使用LLM分析薄弱知识点
    const weakConcepts = await LLMService.analyzeWeakConcepts(wrongQuestions);
    UserData.currentSession.concepts = weakConcepts;
    UserData.saveSession();
    
    // 生成视频推荐
    const videoQueries = await LLMService.generateVideoQueries(weakConcepts);
    const videoResults = await Promise.all(
        videoQueries.map(query => YouTubeService.searchVideos(query))
    );
    const videos = videoResults.flat();
    
    // 显示结果
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    
    document.getElementById('score-display').innerHTML = `
        <h3>Your Score: ${score.toFixed(1)}%</h3>
        ${weakConcepts.length ? `
            <p>Areas needing improvement:</p>
            <ul>
                ${weakConcepts.map(c => `<li>${c.name} (${c.difficulty})</li>`).join('')}
            </ul>
        ` : '<p>Excellent performance across all areas!</p>'}
    `;
    
    document.getElementById('recommendations').innerHTML = videos.length ? 
        videos.map(video => `
            <div class="video-card">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" width="120">
                </div>
                <div class="video-info">
                    <h4><a href="${video.url}" target="_blank">${video.title}</a></h4>
                    <p>${video.channel} • ${video.duration}</p>
                </div>
            </div>
        `).join('') : '<p>No video recommendations found.</p>';
}

function resetQuiz() {
    document.getElementById('result-container').style.display = 'none';
    document.querySelector('.track-selection').style.display = 'grid';
}
