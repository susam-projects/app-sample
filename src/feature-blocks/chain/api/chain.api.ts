import { EntityApi, IHATEOASItem } from "@/common/api";

class ChainApi extends EntityApi<IHATEOASItem> {
  constructor() {
    super("/chain");
  }
}

export const chainApi = new ChainApi();
