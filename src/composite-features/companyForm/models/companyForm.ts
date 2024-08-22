import { z } from "zod";

import i18n from "@/common/i18n";

export const companyFormValuesSchema = z.object({
  companyName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),
  finYearEndDate: z
    .string({
      invalid_type_error: i18n.t("common.form.error.required"),
    })
    .min(1, { message: i18n.t("common.form.error.required") }),
});

export type TCompanyFormValues = z.infer<typeof companyFormValuesSchema>;
