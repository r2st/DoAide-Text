export interface RouteMeta {
  path: string;
  h1: string;
  title: string;
  description: string;
}

export const SITE: { name: string; baseUrl: string; ogImage: string };
export const routes: RouteMeta[];
export function canonicalFor(path: string): string;
export function metaForPath(path: string): RouteMeta | undefined;
export function jsonLdFor(route: RouteMeta): Record<string, unknown>;
