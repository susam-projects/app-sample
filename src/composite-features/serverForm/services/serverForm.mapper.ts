import { IServer } from "@/features/server";

import { TEditServerFormValues } from "../models/serverForm.model.ts";

export const mapDataFromServer = (data: IServer): TEditServerFormValues => {
  return {
    serverName: data.displayName || "",
    enabled: !!data.enabled,
  };
};
