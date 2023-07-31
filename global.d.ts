declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}
// declare module "peace-common";

declare global {
  interface NumberConstructor {
    formatPrice: (price?: number | string) => string;
  }
  declare const DDLogin: any;
  declare const window: Window & { attachEvent: any; DDLogin: any };
}
