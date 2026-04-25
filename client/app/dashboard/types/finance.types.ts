import { ReactNode } from "react";

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

export interface PreviousYearsAggregate {
  year: number;
  totalCollection: number;
}

export interface Defaulter {
  id: string;
  name: string;
  class: string;
  dueAmount: number;
  lastPayment: string;
  status: string;
  contact: string;
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

export interface ClassWiseFeeStatus {
  class: string;
  paidAmount: number;
  unpaidAmount: number;
}

export interface FinanceApiData {
  todayCollection: TodayCollection;
  weeklyCollection: WeeklyCollection[];
  monthlyCollection: MonthlyCollection[];
  yearlyCollection: YearlyCollection[];
  defaulters: Defaulter[];
  latestestTrasaction: Transaction[];
}

export interface FinanceData {
  availableYears: number[];
  year: number;
  data: FinanceApiData;
  previousYearsAggregate: PreviousYearsAggregate[];
  classWiseFeeStatus: ClassWiseFeeStatus[];
}

export interface KpiCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  gradient: string;
  sub?: string;
}


//tooltip 
export interface CustomTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
  dataKey?: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  label?: string | number;
} 