export interface Budget {
  id: string;
  title: string;
  bank: string;
  bankCharges: number;
  amount: number;
  interest: number;
  downPay: number;
  duration: number;
  fromDate: string;
  toDate: string;
  dueDate: string;
  time: string;
  notes: string;
  label: string;
  months: {
    jan: boolean;
    feb: boolean;
    mar: boolean;
    apr: boolean;
    may: boolean;
    jun: boolean;
    jul: boolean;
    aug: boolean;
    sep: boolean;
    oct: boolean;
    nov: boolean;
    dec: boolean;
  };
}
