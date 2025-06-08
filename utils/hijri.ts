import moment from 'moment-hijri'

const hijriMonthsFr = [
  'Muharram', 'Safar', 'Rabi’ al-Awwal', 'Rabi’ al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab',
  'Sha’ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi’dah', 'Dhu al-Hijjah'
];

export function formatHijriDate(gregDate: string) {
  const m = moment(gregDate);

  const iYear = m.iYear();
  const iMonth = m.iMonth();
  const iDate = m.iDate();

  return `${iDate} ${hijriMonthsFr[iMonth]} ${iYear}`;
}

export const monthHijri = hijriMonthsFr[moment(new Date()).iMonth()];

export const yearHijri = moment(new Date()).iYear();