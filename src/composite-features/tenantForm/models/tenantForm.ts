import * as z from "zod";
import { ZodTypeAny } from "zod";

import i18n from "@/common/i18n";

const optional = <T extends ZodTypeAny>(zType: T, isOptional: boolean) => {
  return isOptional ? zType.optional() : zType;
};

const getTenantFormSchema = (isEdit: boolean) => {
  return z.object({
    displayName: z
      .string({ required_error: i18n.t("common.form.error.required") })
      .min(1, { message: i18n.t("common.form.error.required") })
      .trim(),

    originalName: z
      .string({ required_error: i18n.t("common.form.error.required") })
      .min(1, { message: i18n.t("common.form.error.required") })
      .trim(),

    technicalName: z.string().trim().optional(),

    containerName: z
      .string({ required_error: i18n.t("common.form.error.required") })
      .min(1, { message: i18n.t("common.form.error.required") })
      .trim(),

    template: optional(
      z.string({ required_error: i18n.t("common.form.error.required") }).trim(),
      isEdit,
    ),

    databaseVersion: optional(
      z.string({ required_error: i18n.t("common.form.error.required") }).trim(),
      isEdit,
    ),

    containerUrl: z
      .string({ required_error: i18n.t("common.form.error.required") })
      .min(1, { message: i18n.t("common.form.error.required") })
      .trim(),

    containerSize: z
      .string({
        required_error: i18n.t("common.form.error.required"),
      })
      .optional(),

    tag: optional(
      z.array(
        z.object({
          value: z.string({
            required_error: i18n.t("common.form.error.required"),
          }),
          label: z.string({
            required_error: i18n.t("common.form.error.required"),
          }),
        }),
      ),
      !isEdit,
    ),

    tenantId: optional(
      z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),
      !isEdit,
    ),

    tenantSecret: optional(
      z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),
      !isEdit,
    ),

    chain: z
      .string({ required_error: i18n.t("common.form.error.required") })
      .min(1, { message: i18n.t("common.form.error.required") })
      .trim(),
  });
};

export const addTenantFormSchema = getTenantFormSchema(false);
export const editTenantFormSchema = getTenantFormSchema(true);

export type TAddTenantFormValues = z.infer<typeof addTenantFormSchema>;
export type TEditTenantFormValues = z.infer<typeof editTenantFormSchema>;
export type TTenantFormValues = z.infer<ReturnType<typeof getTenantFormSchema>>;

export type TTenantFormSchema = ReturnType<typeof getTenantFormSchema>;
