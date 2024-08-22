import * as z from "zod";

import i18n from "@/common/i18n";

export const serverFormSchema = z.object({
  serverName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, i18n.t("common.form.error.required"))
    .trim(),

  enabled: z.boolean(),
});

export type TEditServerFormValues = z.infer<typeof serverFormSchema>;
