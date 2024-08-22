import { EntityApi } from "@/common/api";

type TTag = string;

class ObjectsPageApi extends EntityApi<TTag> {
  constructor() {
    super("/tags");
  }
}

export const objectsPageApi = new ObjectsPageApi();
