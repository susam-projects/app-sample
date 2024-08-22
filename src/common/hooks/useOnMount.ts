import { EffectCallback, useEffect } from "react";

export const useOnMount = (callback: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
};
