import { toMap } from "@/common/utils/objectUtils.ts";
import { IStoreDataNode } from "@/feature-blocks/objectTree";

import { IModuleListItem, TModuleData } from "../models/formSchema.ts";

export const toModuleDataWithFixedStatus = (
  modules: IStoreDataNode[],
  status: boolean,
): TModuleData => {
  return modules.reduce((acc, module) => {
    acc[module.id] = {
      name: module.title,
      status,
      links: module.selfLinks || [],
    };
    return acc;
  }, {} as TModuleData);
};

export const toModuleData = (
  modules: IModuleListItem[],
  originalModules: IStoreDataNode[],
): TModuleData => {
  const originalModulesMap = toMap(originalModules);

  return modules.reduce((acc, module) => {
    const originalModule = originalModulesMap[module.moduleId];
    acc[module.moduleId] = {
      name: module.name,
      status: module.isEnabled,
      links: originalModule?.selfLinks || [],
    };
    return acc;
  }, {} as TModuleData);
};

export const toSimpleModuleData = (modules: IStoreDataNode[]): TModuleData => {
  return modules.reduce((acc, module) => {
    acc[module.id] = {
      name: module.title,
      status: !!module.isEnabled,
      links: module?.selfLinks || [],
    };
    return acc;
  }, {} as TModuleData);
};

export const treeModulesToModuleListItems = (
  treeModules: IStoreDataNode[],
): IModuleListItem[] => {
  return treeModules.map((treeModule) => ({
    moduleId: treeModule.id,
    name: treeModule.title,
    value: "01/11/2100",
    isEnabled: !!treeModule.isEnabled,
    links: treeModule.selfLinks || [],
  }));
};
