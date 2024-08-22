import { IHATEOASLink, RelType } from "./halApi.ts";

export const getGetLink = (links: IHATEOASLink[]) => {
  return links.find((link) => link.rel === RelType.GetItem);
};

export const getUpdateLink = (links: IHATEOASLink[]) => {
  return links.find((link) => link.rel === RelType.UpdateItem);
};

export const getCreateLink = (links: IHATEOASLink[]) => {
  return links.find((link) => link.rel === RelType.CreateItem);
};

export const getEnableItemLink = (links: IHATEOASLink[]) => {
  return links.find((link) => link.rel === RelType.EnableItem);
};

export const getDisableItemLink = (links: IHATEOASLink[]) => {
  return links.find((link) => link.rel === RelType.DisableItem);
};
