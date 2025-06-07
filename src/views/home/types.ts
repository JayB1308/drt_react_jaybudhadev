import type { SelectValue } from "@components/select";

export type SatelliteObject = {
  noradCatId: string;
  intlDes: string;
  name: string;
  launchDate?: string;
  decayDate?: string;
  objectType?: string;
  launchSiteCode?: string;
  countryCode?: string;
  orbitCode?: string;
};

export type FilterData = {
  objectTypes: SelectValue[];
  attributes: SelectValue[];
  [key: string]: SelectValue[];
};
