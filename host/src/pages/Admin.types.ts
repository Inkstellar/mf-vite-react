export interface NavigationItem {
  id?: number;
  path: string;
  label: string;
  icon: string;
  section: string;
  claims?: string[];
}

export interface IconItem {
  id: number;
  name: string;
  icon: string;
  svg: string;
  category: string;
}

export interface ClaimItem {
  id: number;
  name: string;
  description: string;
  usageCount: number;
  category: string;
  createdAt: string;
}