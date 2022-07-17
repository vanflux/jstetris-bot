
declare module "*.css";

declare interface Window {
  destroyHack?(): void;
}

declare var AUTO_RELOADER: boolean;
declare var VERSION: string;
declare var chrome: any;
