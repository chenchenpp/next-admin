declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}
// declare module "peace-common";

declare global {
  interface NumberConstructor {
    formatPrice: (price?: number | string) => string;
  }
}
