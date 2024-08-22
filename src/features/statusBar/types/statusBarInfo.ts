export interface ITenantInfo {
  id: string;
  name: string;
  isEnabled: boolean;
  tags: string[];
  companiesCount: number | null;
  replicationSitesCount: number | null;
  shopsCount: number | null;
  devicesCount: number | null;
}

export interface IReplicationSiteInfo {
  id: string;
  name: string;
  tierCode: string;
  genVersion: string;
}

export interface IShopInfo {
  id: string;
  name: string;
  isEnabled: boolean;
  tags: string[];
  tiersCode: string;
  adhCode: string;
}
