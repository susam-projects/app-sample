import { useCallback } from "react";

import { useAppDispatch } from "@/app/store";

import { navigate as objectsNavigate } from "../store/objectTree.slice.ts";

export const useObjectsNavigate = () => {
  const dispatch = useAppDispatch();

  const navigate = useCallback(
    (...args: Parameters<typeof objectsNavigate>) => {
      dispatch(objectsNavigate(...args));
    },
    [dispatch],
  );

  return navigate;
};
