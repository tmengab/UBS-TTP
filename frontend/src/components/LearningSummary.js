import React, { useState } from 'react';

export default function LearningSummary({ summary }) {
    const [showAchievements, setShowAchievements] = useState(false);
    
    // 1. 从 localStorage 获取用户名
    const username = localStorage.getItem('username');

    // 2. 创建动态标题，如果用户名存在则使用，否则使用默认标题
    const title = username ? `${username}'s Learning Curve` : 'Your Learning Curve';

    if (!summary) return null;

    const { achievements, medal } = summary;

    return (
        <div className="learning-summary">
            {/* 3. 使用新的动态标题 */}
            <h2>{title}</h2>
            <div className="summary-content">
                {medal && (
                    <div className="medal-section">
                        <img src={medal.imageUrl} alt={medal.name} className="medal-image" />
                        <p className="medal-name">You've earned the <strong>{medal.name}</strong> award!</p>
                    </div>
                )}
                <div className="certifications-section" style={{ position: 'relative', marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Your Achievements</h3>
                        {achievements && achievements.length > 0 && (
                            <button
                                onClick={() => setShowAchievements(!showAchievements)}
                                style={{
                                    padding: '5px 15px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    background: '#3949ab',
                                    color: 'white',
                                    border: '1px solid #5c6bc0',
                                    borderRadius: '8px'
                                }}
                            >
                                {showAchievements ? 'Hide Details' : 'Show Details'}
                            </button>
                        )}
                    </div>

                    {showAchievements && (
                        achievements.length > 0 ? (
                            <ul style={{ marginTop: '10px' }}>
                                {achievements.map(ach => (
                                    <li key={ach.id}>
                                        <strong>{ach.trackName} - {ach.conceptName} (Level {ach.level})</strong>
                                        <p>You have completed this level, Congrats!</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Complete your first level to see your achievements here!</p>
                        )
                    )}

                    {!showAchievements && achievements.length === 0 && (
                        <p>Complete your first level to see your achievements here!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
