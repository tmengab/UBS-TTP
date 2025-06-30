const Concept = require('../models/Concept');
const Question = require('../models/Question');
const UserProgress = require('../models/UserProgress');

async function calculateUserSummary(userId) {
    try {
        const userProgressList = await UserProgress.find({ userId }).populate('conceptId', 'name track');
        if (!userProgressList || userProgressList.length === 0) {
            return { achievements: [], medal: null };
        }

        let achievements = [];
        let completedLevelsCount = 0;

        for (const progress of userProgressList) {
            if (!progress.conceptId) continue;
            for (const level of [1, 2, 3]) {
                const questionsInLevel = await Question.find({ conceptId: progress.conceptId._id, level: level });
                if (questionsInLevel.length === 0) continue;

                const correctlyAnsweredIdsInLevel = progress.attemptedQuestions
                    .filter(a => a.isCorrect && a.level === level)
                    .map(a => a.questionId.toString());

                const allQuestionIdsInLevel = questionsInLevel.map(q => q._id.toString());
                const isLevelComplete = allQuestionIdsInLevel.every(id => correctlyAnsweredIdsInLevel.includes(id));

                if (isLevelComplete) {
                    completedLevelsCount++;
                    achievements.push({
                        id: `${progress.conceptId._id}-level-${level}`,
                        trackName: progress.conceptId.track.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                        conceptName: progress.conceptId.name,
                        level: level
                    });
                }
            }
        }
        
        // 新的奖牌逻辑：基于完成的 tracks 数量
        const trackProgress = await getAllTracksProgress(userId);
        let completedTracksCount = 0;
        
        for (const [trackKey, progress] of Object.entries(trackProgress)) {
            if (progress.isComplete) {
                completedTracksCount++;
            }
        }
        
        let medal = null;
        if (completedTracksCount >= 5) {
            medal = { name: "Gold Learner" };
        } else if (completedTracksCount >= 4) {
            medal = { name: "Silver Learner" };
        } else if (completedTracksCount >= 1) {
            medal = { name: "Bronze Learner" };
        }

        return { achievements, medal };

    } catch (err) {
        console.error("Error in calculateUserSummary:", err);
        return { achievements: [], medal: null, error: true };
    }
}

// 新增函数：检查 track 是否完全完成
async function checkTrackCompletion(userId, trackName) {
    try {
        // 获取该 track 下的所有 concepts
        const concepts = await Concept.find({ track: trackName });
        if (concepts.length === 0) {
            return { isComplete: false, completedConcepts: 0, totalConcepts: 0 };
        }

        let completedConcepts = 0;
        let totalLevels = 0;
        let completedLevels = 0;

        for (const concept of concepts) {
            let conceptComplete = true;
            
            // 检查该 concept 的所有 levels (1, 2, 3)
            for (const level of [1, 2, 3]) {
                const questionsInLevel = await Question.find({ conceptId: concept._id, level: level });
                if (questionsInLevel.length === 0) continue; // 如果这个 level 没有题目，跳过
                
                totalLevels++;
                
                // 获取用户在这个 level 的进度
                const userProgress = await UserProgress.findOne({ userId, conceptId: concept._id });
                if (!userProgress) {
                    conceptComplete = false;
                    continue;
                }

                const correctlyAnsweredIdsInLevel = userProgress.attemptedQuestions
                    .filter(a => a.isCorrect && a.level === level)
                    .map(a => a.questionId.toString());

                const allQuestionIdsInLevel = questionsInLevel.map(q => q._id.toString());
                const isLevelComplete = allQuestionIdsInLevel.every(id => correctlyAnsweredIdsInLevel.includes(id));

                if (isLevelComplete) {
                    completedLevels++;
                } else {
                    conceptComplete = false;
                }
            }
            
            if (conceptComplete) {
                completedConcepts++;
            }
        }

        const isComplete = completedConcepts === concepts.length;
        
        return {
            isComplete,
            completedConcepts,
            totalConcepts: concepts.length,
            completedLevels,
            totalLevels
        };
    } catch (err) {
        console.error("Error in checkTrackCompletion:", err);
        return { isComplete: false, completedConcepts: 0, totalConcepts: 0 };
    }
}

// 新增函数：获取用户在所有 tracks 的完成情况
async function getAllTracksProgress(userId) {
    try {
        const tracks = ['basic', 'data-structures', 'full-stack', 'data-science', 'ai-learning'];
        const trackProgress = {};

        for (const track of tracks) {
            const progress = await checkTrackCompletion(userId, track);
            trackProgress[track] = progress;
        }

        return trackProgress;
    } catch (err) {
        console.error("Error in getAllTracksProgress:", err);
        return {};
    }
}

module.exports = { 
    calculateUserSummary, 
    checkTrackCompletion, 
    getAllTracksProgress 
};
