import { allnav } from "./nav";

export interface NavigationItem {
  path: string;
  label: string;
  icon: string; // SVG string or icon name
  section?: string;
}

export interface RemoteConfig {
  name: string;
  version: string;
  navigation: NavigationItem[];
  routes: string[];
}

export const remoteConfig: RemoteConfig = {
  name: 'Remote Module',
  version: '1.0.0',
  navigation: allnav,
  routes: ['/services', '/portfolio','/users']
};
