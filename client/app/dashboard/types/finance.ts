export interface FinanceDashboardData {
  availableYears: number[];
  year: number;
  data: FinanceData;
  previousYearsAggregate: YearlyAggregate[];
  classWiseFeeStatus: ClassWiseFeeStatus[];
}

export interface FinanceData {
  todayCollection: TodayCollection;
  weeklyCollection: WeeklyCollection[];
  monthlyCollection: MonthlyCollection[];
  yearlyCollection: YearlyCollection[];
  defaulters: Defaulter[];
  latestestTrasaction: Transaction[];
}

export interface TodayCollection {
  date: string;
  amount: number;
  status: string;
}

export interface WeeklyCollection {
  label: string;
  amount: number;
  dayIndex: number;
}

export interface MonthlyCollection {
  label: string;
  amount: number;
}

export interface YearlyCollection {
  label: string;
  amount: number;
  monthIndex: number;
}

export interface Defaulter {
  id: string;
  name: string;
  class: string;
  dueAmount: number;
  lastPayment?: string;
  status: string;
  contact?: string;
}

export interface Transaction {
  receipt: string;
  student: string;
  class: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

export interface YearlyAggregate {
  year: number;
  totalCollection: number;
}

export interface ClassWiseFeeStatus {
  class: string;
  paidAmount: number;
  unpaidAmount: number;
}
