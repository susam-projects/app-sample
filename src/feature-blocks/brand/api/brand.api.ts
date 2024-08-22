import { EntityApi, IHATEOASItem } from "@/common/api";

class BrandApi extends EntityApi<IHATEOASItem> {
  constructor() {
    super("/brand");
  }
}

export const brandApi = new BrandApi();
