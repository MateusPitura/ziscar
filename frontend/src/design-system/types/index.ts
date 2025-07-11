import { icons } from "../constants/icons";

export type ButtonState = "disabled" | "loading";
export type ButtonColor = "green" | "gray" | "darkBlue" | "lightBlue" | "red";

export type IconsName = keyof typeof icons;
