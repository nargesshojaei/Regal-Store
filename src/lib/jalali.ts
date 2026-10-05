// تبدیل تاریخ میلادی و شمسی.
// فرم خرید تاریخ را میلادی نگه می‌دارد تا مقایسه «گذشته نباشد» ساده بماند،
// ولی روی صفحه فقط عدد شمسی نشان داده می‌شود.

export type JalaliDate = {
  year: number;
  month: number;
  day: number;
};

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function div(a: number, b: number) {
  return Math.floor(a / b);
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let year = gy;
  let jalaliYear = 0;

  if (year > 1600) {
    jalaliYear = 979;
    year -= 1600;
  } else {
    year -= 621;
  }

  const leapYear = gm > 2 ? year + 1 : year;
  let days =
    365 * year +
    div(leapYear + 3, 4) -
    div(leapYear + 99, 100) +
    div(leapYear + 399, 400) -
    80 +
    gd +
    monthDays[gm - 1];

  jalaliYear += 33 * div(days, 12053);
  days %= 12053;
  jalaliYear += 4 * div(days, 1461);
  days %= 1461;

  if (days > 365) {
    jalaliYear += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  let month = 0;
  let day = 0;

  if (days < 186) {
    month = 1 + div(days, 31);
    day = 1 + (days % 31);
  } else {
    month = 7 + div(days - 186, 30);
    day = 1 + ((days - 186) % 30);
  }

  return { year: jalaliYear, month, day };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number) {
  let year = jy;
  let gregorianYear = 0;

  if (year > 979) {
    gregorianYear = 1600;
    year -= 979;
  } else {
    gregorianYear = 621;
  }

  let days =
    365 * year +
    div(year, 33) * 8 +
    div((year % 33) + 3, 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gregorianYear += 400 * div(days, 146097);
  days %= 146097;

  if (days > 36524) {
    gregorianYear += 100 * div(days - 1, 36524);
    days %= 36524;
    if (days >= 365) days += 1;
  }

  gregorianYear += 4 * div(days, 1461);
  days %= 1461;

  if (days > 365) {
    gregorianYear += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  let day = days + 1;
  const leap =
    (gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) ||
    gregorianYear % 400 === 0;
  const monthDays = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let month = 1;

  for (month = 1; month <= 12 && day > monthDays[month]; month += 1) {
    day -= monthDays[month];
  }

  return { year: gregorianYear, month, day };
}

export function toIso(year: number, month: number, day: number) {
  const monthText = String(month).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");
  return `${year}-${monthText}-${dayText}`;
}

export function jalaliToIso(date: JalaliDate) {
  const gregorian = jalaliToGregorian(date.year, date.month, date.day);
  return toIso(gregorian.year, gregorian.month, gregorian.day);
}

export function isoToJalali(iso: string): JalaliDate | null {
  const parts = iso.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!year || !month || !day) return null;
  if (year < 1700) return null;
  return gregorianToJalali(year, month, day);
}

export function todayJalali(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

// اسفند ۳۰ روزه فقط در سال کبیسه معتبر است
export function jalaliMonthLength(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;

  const back = gregorianToJalali(
    jalaliToGregorian(year, 12, 30).year,
    jalaliToGregorian(year, 12, 30).month,
    jalaliToGregorian(year, 12, 30).day,
  );
  const sameDay = back.year === year && back.month === 12 && back.day === 30;
  return sameDay ? 30 : 29;
}

export function shiftJalaliMonth(date: JalaliDate, step: number): JalaliDate {
  let month = date.month + step;
  let year = date.year;

  while (month < 1) {
    month += 12;
    year -= 1;
  }
  while (month > 12) {
    month -= 12;
    year += 1;
  }

  return { year, month, day: 1 };
}
