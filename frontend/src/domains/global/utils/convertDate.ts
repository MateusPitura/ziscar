import { format as fnsFormat } from "date-fns";

interface FormatDateProps {
  date: Date;
  format: string;
}

const ONE_HOUR = 60000;

export default function convertDate({ date, format }: FormatDateProps) {
  const dateWithoutTimeZone = new Date(
    date.valueOf() + date.getTimezoneOffset() * ONE_HOUR
  );
  return fnsFormat(dateWithoutTimeZone, format);
}
