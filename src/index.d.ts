declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg?react" {
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}
