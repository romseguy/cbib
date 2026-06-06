import {
  format,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  intervalToDuration,
  formatDuration as oFormatDuration,
  parseISO,
  setDay,
  setHours,
  setMinutes,
  setSeconds,
  type Duration,
  type DurationUnit,
} from "date-fns";
import { enUS as en, fr } from "date-fns/locale";
import { localize } from "./utils";

/*
compareAsc
  Compare the two dates and return
  1 if the first date is after the second
  -1 if the first date is before the second
  0 if dates are equal.

compareDesc
  Compare the two dates and return
  1 if the first date is before the second 
  -1 if the first date is after the second
   0 if dates are equal.
*/

export const days = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

var DAYS_IN_A_WEEK = 7;

export const formatArray = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
];

const formatDistanceLocale = {
  xSeconds: "{{count}}s",
  xMinutes: "{{count}}m",
  xHours: "{{count}}h",
  xDays: "{{count}}j",
  xMonths: "{{count}}M",
  xYears: "{{count}}y",
} as { [key: string]: string };

export const formatDuration = (
  duration: Duration,
  { format }: { format: DurationUnit[] },
) => {
  return oFormatDuration(duration, {
    format,
    locale: {
      formatDistance: (token, count) => {
        const str = formatDistanceLocale[token];
        if (str) return str.replace("{{count}}", count.toString());
        return count.toString() + "s";
      },
    },
  });
};

export const fullDateString = (date: Date | string, locale: string) => {
  return format(
    typeof date === "string" ? parseISO(date) : date,
    `eeee dd MMMM yyyy @ H'h'mm`,
    {
      locale: locale === "fr" ? fr : en,
    },
  ).replace("@", locale === "fr" ? "à" : "at");
};

export const timeAgo = (args: { date: Date | string }) => {
  let { date } = args;
  if (typeof date === "string") date = parseISO(date);
  const duration = intervalToDuration({
    start: date,
    end: new Date(),
  });
  const format2 = formatArray.filter((f) => {
    if (typeof duration.years === "number" && duration.years > 0)
      return f === "years";
    if (typeof duration.months === "number" && duration.months > 0)
      return f === "months";
    if (typeof duration.days === "number" && duration.days > 0)
      return f === "days";
    if (typeof duration.hours === "number" && duration.hours > 0)
      return f === "hours";
    return f === "minutes";
  });
  const formatted = formatDuration(duration, {
    format: format2 as DurationUnit[],
  });
  return formatted || localize("Il y a quelques secondes", "A few seconds ago");
};
// export const timeAgo = (
//   date?: string | Date,
//   isShort?: boolean,
//   format?: string[],
// ) => {
//   const end =
//     typeof date === "string"
//       ? parseISO(date)
//       : date !== undefined
//       ? date
//       : new Date();
//   const fullDate = fullDateString(end);
//   const duration = intervalToDuration({
//     start: new Date(),
//     end,
//   });
//   const format2 = isShort
//     ? (format || formatArray).filter((f) => {
//         if (typeof duration.years === "number" && duration.years > 0)
//           return f === "years";
//         if (typeof duration.months === "number" && duration.months > 0)
//           return f === "months";
//         if (typeof duration.days === "number" && duration.days > 0)
//           return f === "days";
//         if (typeof duration.hours === "number" && duration.hours > 0)
//           return f === "hours";
//         return f === "minutes";
//       })
//     : format || formatArray;

//   const formatted = formatDuration(duration, {
//     format: format2,
//   });

//   return { timeAgo: formatted === "" ? "1m" : formatted, fullDate };
// };

export const moveDateToCurrentWeek = (date: Date) => {
  const today = new Date();
  return setSeconds(
    setMinutes(
      setHours(setDay(today, getDay(date)), getHours(date)),
      getMinutes(date),
    ),
    getSeconds(date),
  );
};
