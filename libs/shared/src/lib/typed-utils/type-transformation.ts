export type Defined<T> = {
  [P in keyof T]-?: Required<NonNullable<T[P]>>;
};
