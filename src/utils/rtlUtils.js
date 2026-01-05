/**
 * RTL (Right-to-Left) Utility Functions
 * Provides helper functions for RTL language support
 */

// List of RTL language codes
const RTL_LANGUAGES = ['ar', 'he', 'ur', 'fa', 'yi'];

/**
 * Check if a language code represents an RTL language
 * @param {string} languageCode - Language code (e.g., 'ar', 'en', 'de')
 * @returns {boolean} - True if RTL language
 */
export const isRTLLanguage = (languageCode) => {
  if (!languageCode) return false;
  const code = languageCode.toLowerCase().trim();
  return RTL_LANGUAGES.includes(code);
};

/**
 * Get text direction based on language code
 * @param {string} languageCode - Language code
 * @returns {string} - 'rtl' or 'ltr'
 */
export const getDirection = (languageCode) => {
  return isRTLLanguage(languageCode) ? 'rtl' : 'ltr';
};

/**
 * Mirror X coordinate for RTL mode
 * @param {number} x - Original X coordinate
 * @param {number} containerWidth - Container width
 * @returns {number} - Mirrored X coordinate
 */
export const mirrorX = (x, containerWidth) => {
  return containerWidth - x;
};

/**
 * Adjust node position for RTL mode
 * @param {object} node - Node object with position
 * @param {boolean} isRTL - Whether RTL mode is active
 * @param {number} containerWidth - Container width
 * @returns {object} - Node with adjusted position
 */
export const adjustNodePosition = (node, isRTL, containerWidth) => {
  if (!isRTL || !node.position) return node;
  
  return {
    ...node,
    position: {
      ...node.position,
      x: mirrorX(node.position.x, containerWidth),
    },
  };
};

/**
 * Adjust position object for RTL mode
 * @param {object} position - Position object {x, y}
 * @param {boolean} isRTL - Whether RTL mode is active
 * @param {number} containerWidth - Container width
 * @returns {object} - Adjusted position
 */
export const adjustPosition = (position, isRTL, containerWidth) => {
  if (!isRTL || !position) return position;
  
  return {
    ...position,
    x: mirrorX(position.x, containerWidth),
  };
};

/**
 * Get CSS direction value
 * @param {boolean} isRTL - Whether RTL mode is active
 * @returns {string} - 'rtl' or 'ltr'
 */
export const getCSSDirection = (isRTL) => {
  return isRTL ? 'rtl' : 'ltr';
};

/**
 * Get alignment based on direction
 * @param {boolean} isRTL - Whether RTL mode is active
 * @param {string} ltrAlign - Alignment for LTR ('left', 'right', 'center')
 * @returns {string} - Adjusted alignment
 */
export const getAlignment = (isRTL, ltrAlign = 'left') => {
  if (ltrAlign === 'center') return 'center';
  if (!isRTL) return ltrAlign;
  return ltrAlign === 'left' ? 'right' : 'left';
};

/**
 * Get flex direction based on RTL mode
 * @param {boolean} isRTL - Whether RTL mode is active
 * @param {string} baseDirection - Base flex direction ('row', 'column')
 * @returns {string} - Adjusted flex direction
 */
export const getFlexDirection = (isRTL, baseDirection = 'row') => {
  if (baseDirection === 'column' || baseDirection === 'column-reverse') {
    return baseDirection;
  }
  if (!isRTL) return baseDirection;
  return baseDirection === 'row' ? 'row-reverse' : 'row';
};

/**
 * Get margin/padding values adjusted for RTL
 * @param {boolean} isRTL - Whether RTL mode is active
 * @param {object} spacing - Spacing object {left, right, top, bottom}
 * @returns {object} - Adjusted spacing
 */
export const getSpacing = (isRTL, spacing) => {
  if (!isRTL) return spacing;
  
  return {
    ...spacing,
    left: spacing.right,
    right: spacing.left,
  };
};

/**
 * Get language code from language object or ID
 * @param {object|number} language - Language object with code property or language ID
 * @param {array} languages - Array of language objects
 * @returns {string|null} - Language code or null
 */
export const getLanguageCode = (language, languages = []) => {
  if (typeof language === 'string') return language;
  if (language?.code) return language.code;
  if (typeof language === 'number' && languages.length > 0) {
    const lang = languages.find(l => l.id === language);
    return lang?.code || null;
  }
  return null;
};
