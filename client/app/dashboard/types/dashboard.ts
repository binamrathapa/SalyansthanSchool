export interface Trend {
  value: number;
  isPositive: boolean;
}

export interface Metric {
  id: string;
  title: string;
  value: number | string;
  description?: string;
  trend?: Trend;
}

export interface EnrollmentChartData {
  name: string;
  value: number;
}

export interface GenderChartData {
  name: string;
  value: number;
}

export interface Charts {
  enrollment: EnrollmentChartData[];
  gender: GenderChartData[];
}

export interface CollectionSummary {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface PendingDues {
  amount: number;
  count: number;
}

export interface Financials {
  collections: CollectionSummary;
  pendingDues: PendingDues;
  weeklyHistory: number[];
}

export interface DashboardData {
  metrics: Metric[];
  charts: Charts;
  financials: Financials;
}
