import { EntityApi } from "@/common/api";

import { ICompanyData, ICompanyResponse } from "../models/company.ts";

class CompanyApi extends EntityApi<ICompanyResponse, ICompanyData> {
  constructor() {
    super("/company");
  }
}

export const companyApi = new CompanyApi();
