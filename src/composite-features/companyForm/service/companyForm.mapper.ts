import { DAY_MONTH_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/common/constants";
import { formatDate } from "@/common/utils/dateUtils.ts";
import { entityUserInfo } from "@/feature-blocks/userInfo";
import { ICompanyData, ICompanyResponse } from "@/features/company";

import { TCompanyFormValues } from "../models/companyForm.ts";

export const mapDataFromServer = (
  data: ICompanyResponse,
): TCompanyFormValues => {
  return {
    companyName: data.displayName || "",
    finYearEndDate: formatDate({
      inputDate: data.financialYearEnd,
      outputFormat: DAY_MONTH_DATE_FORMAT,
    }),
  };
};

export const mapFormValuesToServer = (
  values: TCompanyFormValues,
  tenantId: string,
  companyId?: string,
): ICompanyData => {
  return {
    ...entityUserInfo.getUserData(),
    displayName: values.companyName,
    financialYearEnd: formatDate({
      inputDate: values.finYearEndDate,
      inputFormat: DAY_MONTH_DATE_FORMAT,
      outputFormat: SERVER_DATE_FORMAT,
      outputOverride: { hours: 0, minutes: 0, seconds: 0 },
    }),
    idCompany: companyId,
    idTenant: tenantId,
  };
};
