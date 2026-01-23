export interface NavItem {
  _id?: string;
  title: string;
  url: string;
  order: number;
  isOpenNewTab?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
