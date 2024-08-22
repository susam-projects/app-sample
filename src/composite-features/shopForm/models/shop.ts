import { z } from "zod";

import i18n from "@/common/i18n";

export const editShopFormValuesSchema = z.object({
  displayName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  completeDisplayName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  shortDisplayName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  shopCode: z.string().trim().optional(),

  adherentCode: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  thirdPartyCode: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  pumpGroup: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  chain: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  company: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  replicationSite: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  tag: z.array(
    z.object({
      value: z.string({ required_error: i18n.t("common.form.error.required") }),
      label: z.string({ required_error: i18n.t("common.form.error.required") }),
    }),
  ),

  closingPeriods: z.array(
    z.object({
      start: z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),
      end: z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),
    }),
  ),
});

export type TEditShopFormValues = z.infer<typeof editShopFormValuesSchema>;

export const createShopFormValuesSchema = z.object({
  displayName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  completeDisplayName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  shortDisplayName: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  adherentCode: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  thirdPartyCode: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  pumpGroup: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  chain: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  storeSign: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  company: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),

  replicationSite: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),
});

export type TCreateShopFormValues = z.infer<typeof createShopFormValuesSchema>;

export const newPumoGroupFormValuesSchema = z.object({
  newPumpGroup: z
    .string({ required_error: i18n.t("common.form.error.required") })
    .min(1, { message: i18n.t("common.form.error.required") })
    .trim(),
});

export type TNewPumoGroupFormValues = z.infer<
  typeof newPumoGroupFormValuesSchema
>;
