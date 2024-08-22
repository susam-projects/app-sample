import { useCallback, useState } from "react";

export const useTagList = () => {
  const [isCompactTagList, setIsCompactTagList] = useState(true);

  const toggleIsCompactTagList = useCallback(() => {
    setIsCompactTagList((prev) => !prev);
  }, [setIsCompactTagList]);

  return {
    isCompactTagList,
    toggleIsCompactTagList,
  };
};
