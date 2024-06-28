import { NepaliDatepickerService } from 'np-datepicker-angular';

export function convertTo12HourFormat(time24: string): string {
  const [hours, minutes] = time24.split(':');
  const hoursInt = parseInt(hours, 10);
  const suffix = hoursInt >= 12 ? 'PM' : 'AM';
  const adjustedHours = ((hoursInt + 11) % 12) + 1; // Converts "0" hours to "12"
  return `${adjustedHours}:${minutes} ${suffix}`;
}

export function convertTo24HourFormat(time12: string): string {
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  return `${hours}:${minutes}:00`;
}
// export class Utility {
//   static _nepaliDatepickerService: any;

//   constructor(_nepaliDatepickerService: NepaliDatepickerService) {
//     Utility._nepaliDatepickerService = _nepaliDatepickerService;
//   }

//   static adToBs(date: string): string {
//     return Utility._nepaliDatepickerService.ADToBS(date, 'yyyy/mm/dd');
//   }
// }
