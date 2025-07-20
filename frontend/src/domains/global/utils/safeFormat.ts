import { format as fnsFormat, parseISO } from "date-fns";
import { DateFormats } from "../types";

interface FormatDateProps {
  date: string | Date;
  format: DateFormats;
}

export default function safeFormat({ date, format }: FormatDateProps) {
  if (date instanceof Date) {
    return fnsFormat(parseISO(date.toISOString()), format);
  }
  return fnsFormat(parseISO(date), format);
}
