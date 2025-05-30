export const Shape = {
  Rect: "rect",
  RoundedRect: "roundedRect",
  Circle: "circle",
  Diamond: "diamond"
} as const;

export const AlternationMode = {
  None: "none",
  Day: "day",
  Week: "week",
  Month: "month",
  Year: "year",
  Custom: "custom"
} as const;

export const Layout = {
  Month: "month",
  Week: "week",
  Weekday: "weekday",
  Custom: "custom"
} as const;
