export const isClassMatch = (v: string): boolean => /^\s*class\b/.test(v);

export const isFunctionMatch = (v: string): boolean => /^\s*function/.test(v);

export const isArrowFunctionMatch = (v: string): boolean => /(^\([^)]*\) *=>)|(^[^=]*=>)/.test(v);
