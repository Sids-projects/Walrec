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
}
