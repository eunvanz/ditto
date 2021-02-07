export const patterns = {
  wordsWithNoSpace: {
    value: /^\w+\S$/,
    message: "2자 이상의 영문과 숫자를 공백없이 입력해주세요.",
  },
};

export const getIntentionPaddingByDepth = (depth?: number) => {
  return depth ? depth * 16 : undefined;
};
