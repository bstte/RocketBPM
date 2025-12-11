export const getLevelKey = (currentLevel, currentParentId) => {
    return currentParentId !== null
        ? `level${currentLevel}_${currentParentId}`
        : `level${currentLevel}`;
};
