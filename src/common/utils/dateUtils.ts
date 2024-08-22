import dayjs, { UnitType } from "dayjs";
import utc from "dayjs/plugin/utc";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(utc);

export const formatDate = ({
  inputDate,
  inputFormat,
  outputFormat,
  outputTimezone = "UTC",
  outputOverride = {},
}: {
  inputDate?: string;
  inputFormat?: string;
  outputFormat: string;
  outputTimezone?: "UTC" | "Local";
  outputOverride?: Partial<Record<UnitType, number>>;
}) => {
  let date = dayjs.utc(inputDate, inputFormat || undefined);
  if (inputDate && date.isValid()) {
    Object.entries(outputOverride).forEach(([unit, value]) => {
      date = date.set(unit as UnitType, value);
    });
    if (outputTimezone === "Local") {
      return date.local().format(outputFormat);
    }
    return date.format(outputFormat);
  }
  return "";
};
