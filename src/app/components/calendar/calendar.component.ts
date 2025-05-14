import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  @Input() isHorizontalView: boolean = false;
  @Output() dateSelected = new EventEmitter<Date>();
  @ViewChild('daysContainer') daysContainer!: ElementRef;

  currentDate = new Date();
  currentMonth!: number;
  currentYear!: number;
  daysInMonth: number[] = [];
  selectedDay: number | null = null;
  today = new Date();

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  ngOnInit() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  generateCalendar(year: number, month: number) {
    this.daysInMonth = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.push(0); // 0 = empty
    }

    for (let day = 1; day <= totalDays; day++) {
      this.daysInMonth.push(day);
    }
  }

  changeMonth(offset: number) {
    this.currentMonth += offset;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.selectedDay = null; // reset selection
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  isToday(day: number): boolean {
    return (
      day === this.today.getDate() &&
      this.currentMonth === this.today.getMonth() &&
      this.currentYear === this.today.getFullYear()
    );
  }

  selectDay(day: number) {
    if (day === 0) return;
    this.selectedDay = day;
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.dateSelected.emit(selectedDate);
  }

  scrollDays(direction: 'left' | 'right') {
    const container = this.daysContainer.nativeElement as HTMLElement;
    const scrollAmount = 150;
    direction === 'left'
      ? (container.scrollLeft -= scrollAmount)
      : (container.scrollLeft += scrollAmount);
  }
}
