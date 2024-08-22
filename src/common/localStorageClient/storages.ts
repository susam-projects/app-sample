import { StorageWrapper } from "./storageWrapper.ts";

export const ls = new StorageWrapper(window.localStorage);
export const ss = new StorageWrapper(window.sessionStorage);
