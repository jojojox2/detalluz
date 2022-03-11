export interface Notice {
  message: string;
  type?: NoticeType;
}

export enum NoticeType {
  DEFAULT = "default",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
}
