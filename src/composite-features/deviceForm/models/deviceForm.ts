import { z } from "zod";

import i18n from "@/common/i18n";

export const deviceFormValuesSchema = z.object({
  deviceType: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  displayName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  deviceNumber: z.coerce
    .number({ invalid_type_error: i18n.t("common.form.error.number") })
    .int()
    .positive()
    .min(1)
    .optional(),

  isEnabled: z.boolean().optional(),
});

export type TDeviceFormValues = z.infer<typeof deviceFormValuesSchema>;
