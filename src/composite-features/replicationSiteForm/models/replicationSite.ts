import { z } from "zod";

import i18n from "@/common/i18n";
import { ReplicationSiteTypesEnum } from "features/replicationSite";

export const getReplicationSiteFormSchema = () => {
  return z
    .object({
      displayName: z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),

      thirdPartyCode: z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),

      guId: z.string().optional(),

      baseId: z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),

      siteType: ReplicationSiteTypesEnum,

      genVersion: z.string().optional(),

      sender: z
        .string({
          required_error: i18n.t("common.form.error.required"),
        })
        .trim(),

      startReplicationRange: z.coerce
        .number({
          required_error: i18n.t("common.form.error.required"),
          invalid_type_error: i18n.t("common.form.error.number"),
        })
        .int()
        .positive()
        .min(1),

      endReplicationRange: z.coerce
        .number({
          required_error: i18n.t("common.form.error.required"),
          invalid_type_error: i18n.t("common.form.error.number"),
        })
        .int()
        .positive()
        .min(1),

      versionIdStart: z.coerce
        .number({
          required_error: i18n.t("common.form.error.required"),
          invalid_type_error: i18n.t("common.form.error.number"),
        })
        .int(),

      versionIdEnd: z.coerce
        .number({
          required_error: i18n.t("common.form.error.required"),
          invalid_type_error: i18n.t("common.form.error.number"),
        })
        .int(),

      maxToken: z.coerce
        .number({
          required_error: i18n.t("common.form.error.required"),
          invalid_type_error: i18n.t("common.form.error.number"),
        })
        .int(),

      mainShop: z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, { message: i18n.t("common.form.error.required") })
        .trim(),
    })
    .refine(
      (values) => {
        return values.startReplicationRange < values.endReplicationRange;
      },
      {
        message: i18n.t("common.form.error.startRangeValue"),
        path: ["startReplicationRange"],
      },
    );
};

export const addReplicationSiteFormValuesSchema =
  getReplicationSiteFormSchema();
export const editReplicationSiteFormValuesSchema =
  getReplicationSiteFormSchema();

export type TAddReplicationSiteFormValues = z.infer<
  typeof addReplicationSiteFormValuesSchema
>;
export type TEditReplicationSiteFormValues = z.infer<
  typeof editReplicationSiteFormValuesSchema
>;

export type TReplicationSiteFormValues = z.infer<
  ReturnType<typeof getReplicationSiteFormSchema>
>;
export type TReplicationSiteFormSchema = ReturnType<
  typeof getReplicationSiteFormSchema
>;
