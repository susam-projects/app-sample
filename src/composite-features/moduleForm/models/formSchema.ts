import dayjs from "dayjs";
import { z } from "zod";

import { IHATEOASLink } from "@/common/api";
import { DATE_FORMAT } from "@/common/constants";
import i18n from "@/common/i18n";

export const moduleListFormValuesSchema = z.object({
  modules: z.array(
    z
      .object({
        moduleId: z.string(),
        value: z.string().nullable(),
        name: z.string(),
        isEnabled: z.boolean(),
      })
      .refine(
        (module) => {
          return (
            !module.isEnabled ||
            !module.value ||
            dayjs(module.value, DATE_FORMAT) > dayjs().subtract(1, "day")
          );
        },
        {
          message: i18n.t("common.form.error.dateCannotBeInPast"),
          path: ["value"],
        },
      )
      .refine(
        (module) => {
          return !module.isEnabled || !!module.value;
        },
        {
          message: i18n.t("common.form.error.required"),
          path: ["value"],
        },
      ),
  ),
});

export type TModuleListFormValues = z.infer<typeof moduleListFormValuesSchema>;

export interface IModuleListItem {
  moduleId: string;
  name: string;
  value: string | null;
  isEnabled: boolean;
}

export type TModuleData = Record<
  string,
  {
    name: string;
    status: boolean;
    links: IHATEOASLink[];
  }
>;
