import { IHATEOASLink } from "@/common/api";
import i18n from "@/common/i18n";
import { entityUserInfo } from "@/feature-blocks/userInfo";
import { moduleApi } from "@/features/module";

import { TModuleData } from "../models/formSchema.ts";

interface IModuleInfo {
  id: string;
  name: string;
  links: IHATEOASLink[];
}

const getModulesInfo = (
  moduleData: TModuleData,
  status: boolean,
): IModuleInfo[] => {
  return Object.entries(moduleData)
    .filter(([, moduleInfo]) => moduleInfo.status === status)
    .map(([moduleId, moduleInfo]) => ({
      id: moduleId,
      name: moduleInfo.name,
      links: moduleInfo.links,
    }));
};

export const moduleStatusUpdater = {
  async setModuleStatuses(
    tenantId: string,
    shopId: string,
    moduleData: TModuleData,
  ) {
    const modulesToEnable = getModulesInfo(moduleData, true);
    const modulesToDisable = getModulesInfo(moduleData, false);
    const { okResponses: okEnableResponses, error: enableError } =
      await moduleStatusUpdater.enableModules(
        tenantId,
        shopId,
        modulesToEnable,
      );
    if (enableError) {
      return {
        okResponses: okEnableResponses,
        error: enableError,
      };
    }

    const { okResponses: okDisableResponses, error: disableError } =
      await moduleStatusUpdater.disableModules(
        tenantId,
        shopId,
        modulesToDisable,
      );
    if (disableError) {
      return {
        okResponses: okEnableResponses.concat(okDisableResponses),
        error: disableError,
      };
    }

    return { okResponses: okEnableResponses.concat(okDisableResponses) };
  },

  async enableModules(
    tenantId: string,
    shopId: string,
    modulesInfo: IModuleInfo[],
  ) {
    try {
      const enableModuleRequests = modulesInfo.map((moduleInfo) =>
        moduleApi.enableModule(moduleInfo.links, {
          ...entityUserInfo.getUserData(),
          idTenant: tenantId,
          idShop: shopId,
          idModule: moduleInfo.id,
          enabled: true,
        }),
      );
      const responses = await Promise.all(enableModuleRequests);
      const okResponses = responses
        .filter((response) => {
          return response.status === 200;
        })
        .map((response, i) => ({
          moduleName: modulesInfo[i].name,
          data: response.data,
        }));
      const isOnlyOk = okResponses.length === responses.length;
      if (isOnlyOk) {
        return { okResponses };
      } else {
        return { okResponses, error: i18n.t("module.error.setStatus") };
      }
    } catch {
      /* empty */
    }

    return { okResponses: [], error: i18n.t("module.error.setStatus") };
  },

  async disableModules(
    tenantId: string,
    shopId: string,
    modulesInfo: IModuleInfo[],
  ) {
    try {
      const enableModuleRequests = modulesInfo.map((moduleInfo) =>
        moduleApi.disableModule(moduleInfo.links, {
          ...entityUserInfo.getUserData(),
          idTenant: tenantId,
          idShop: shopId,
          idModule: moduleInfo.id,
          enabled: false,
        }),
      );
      const responses = await Promise.all(enableModuleRequests);
      const okResponses = responses
        .filter((response) => {
          return response.status === 200;
        })
        .map((response, i) => ({
          moduleName: modulesInfo[i].name,
          data: response.data,
        }));
      const isOnlyOk = okResponses.length === responses.length;
      if (isOnlyOk) {
        return { okResponses };
      } else {
        return { okResponses, error: i18n.t("module.error.setStatus") };
      }
    } catch {
      /* empty */
    }

    return { okResponses: [], error: i18n.t("module.error.setStatus") };
  },
};
