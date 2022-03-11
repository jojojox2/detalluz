export type RouterLinkTyped = string | RouterUrlFragment[] | null | undefined;

export type RouterUrlFragment = string | number | RouterCommand;

export interface RouterCommand {
  outlets?: RouterOutlets;
  segmentPath?: string;
  expand?: boolean;
}

export interface RouterOutlets {
  primary?: RouterLinkTyped;
  [key: string]: RouterLinkTyped;
}
