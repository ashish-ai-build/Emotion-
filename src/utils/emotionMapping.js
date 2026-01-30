/**
 * Maps MediaPipe Face Blendshapes to 5 core emotions.
 * 
 * @param {Object} blendshapes - Key-value pair of blendshape names and scores.
 * @returns {Array} - Array of objects containing emotion label and score, sorted by score.
 */
export const calculateEmotions = (blendshapes) => {
    if (!blendshapes) return [];

    // Helper to safely get score
    const getScore = (name) => {
        const shape = blendshapes.find(s => s.categoryName === name);
        return shape ? shape.score : 0;
    };

    const eyeWide = (getScore('eyeWideLeft') + getScore('eyeWideRight')) / 2;
    const browOuterUp = (getScore('browOuterUpLeft') + getScore('browOuterUpRight')) / 2;

    const happyScore = (getScore('mouthSmileLeft') + getScore('mouthSmileRight')) / 2;

    const sadScore = Math.max(0, Math.min(1, (
        getScore('mouthFrownLeft') +
        getScore('mouthFrownRight') +
        getScore('browInnerUp') * 1.5 - (eyeWide * 1.5) // Penalize Sad if eyes are wide (Surprised)
    ) * 0.7));

    const angryScore = Math.max(0, Math.min(1, (
        getScore('browDownLeft') +
        getScore('browDownRight') +
        (getScore('eyeSquintLeft') + getScore('eyeSquintRight')) -
        (getScore('jawOpen') * 0.5) -
        (happyScore * 1.5) // Penalize Angry if smiling (Smiling causes squinting)
    ) * 0.6));

    const surprisedScore = Math.min(1, (
        eyeWide +
        browOuterUp +
        getScore('jawOpen') * 2.0
    ) * 0.5);

    const emotions = [
        { label: 'Happy', score: happyScore, color: '#22c55e' }, // Green
        { label: 'Sad', score: sadScore, color: '#3b82f6' },   // Blue
        { label: 'Angry', score: angryScore, color: '#ef4444' }, // Red
        { label: 'Surprised', score: surprisedScore, color: '#eab308' }, // Yellow
    ];

    // Calculate Neutral (inverse of the max of others, with more headroom)
    const maxEmotionScore = Math.max(happyScore, sadScore, angryScore, surprisedScore);
    const neutralScore = Math.max(0, 1 - maxEmotionScore * 1.25);

    emotions.push({ label: 'Neutral', score: neutralScore, color: '#94a3b8' }); // Slate

    return emotions.sort((a, b) => b.score - a.score);
};

export const getDominantEmotion = (emotions) => {
    if (!emotions || emotions.length === 0) return { label: 'Neutral', score: 0, color: '#94a3b8' };
    return emotions[0];
};
