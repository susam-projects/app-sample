import { EntityApi } from "@/common/api";

import { TContainerSize } from "../models/containerSize.ts";

class ContainerSizeApi extends EntityApi<TContainerSize> {
  constructor() {
    super("/containerSize");
  }
}

export const containerSizeApi = new ContainerSizeApi();
