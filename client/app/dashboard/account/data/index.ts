import rawData from "../finance-data.json";
import {
  FinanceData,
  Defaulter,
  Transaction,
  WeeklyCollection,
  MonthlyCollection,
  YearlyCollection,
  PreviousYearsAggregate,
  ClassWiseFeeStatus,
} from "@/app/dashboard/types/finance.types";

// Color constants
export const TEAL = "#14b8a6";
export const ROSE = "#f43f5e";
export const GREEN = "#22c55e";
export const BLUE = "#3b82f6";
export const AMBER = "#f59e0b";
export const VIOLET = "#8b5cf6";

// Color palette
export const COLOR_PALETTE = [
  "#009688", "#FF5722", "#00A65A", "#536DFE", "#FF9800", "#9C27B0",
  "#546E7A", "#22A65A", "#C06A1F", "#7C3FB0", "#E09C1F", "#4FAF7E",
  "#5B57C5", "#E6D98A", "#5A7FD8", "#5FB8C9", "#79B94C", "#A7C843",
  "#E0A93C", "#E0662F", "#E04F4F", "#009E82", "#38B2A6", "#2FA0C3",
  "#6FAF90", "#B78484", "#2A7BC0"
];

export const financeData = rawData as FinanceData;

export const availableYears = financeData.availableYears;
export const selectedYear = financeData.year;

export const todayCollection = financeData.data.todayCollection;
export const weeklyCollectionData: WeeklyCollection[] = financeData.data.weeklyCollection;
export const monthlyCollectionData: MonthlyCollection[] = financeData.data.monthlyCollection;
export const yearlyCollectionData: YearlyCollection[] = financeData.data.yearlyCollection;
export const defaultersData: Defaulter[] = financeData.data.defaulters;
export const recentTransactionsData: Transaction[] = financeData.data.latestestTrasaction;
export const previousYearsAggregateData: PreviousYearsAggregate[] =
  financeData.previousYearsAggregate;
export const classWiseFeeStatusData: ClassWiseFeeStatus[] =
  financeData.classWiseFeeStatus;

// KPI calculations
export const totalDueAmount = defaultersData.reduce(
  (sum, item) => sum + item.dueAmount,
  0
);

export const thisMonthCollection = monthlyCollectionData.reduce(
  (sum, item) => sum + item.amount,
  0
);

export const thisYearCollection = yearlyCollectionData.reduce(
  (sum, item) => sum + item.amount,
  0
);

const previousYearRecord = previousYearsAggregateData.find(
  (item) => item.year === selectedYear - 1
);

export const previousYearCollection = previousYearRecord?.totalCollection ?? 0;

export const collectionGrowthPercentage =
  previousYearCollection > 0
    ? ((thisYearCollection - previousYearCollection) / previousYearCollection) * 100
    : 0;

const latestWeeklyAmount =
  weeklyCollectionData.length > 0
    ? weeklyCollectionData.reduce((sum, item) => sum + item.amount, 0)
    : 0;

const avgWeeklyAmount =
  weeklyCollectionData.length > 0
    ? latestWeeklyAmount / weeklyCollectionData.length
    : 0;

export const kpiData = {
  todayCollection: {
    value: `Rs.${todayCollection.amount.toLocaleString()}`,
    sub: todayCollection.status,
  },

  totalDue: {
    value: `Rs.${totalDueAmount.toLocaleString()}`,
    sub: "Outstanding dues",
  },

  yearCollection: {
    value: `Rs.${thisYearCollection.toLocaleString()}`,
    sub: `${collectionGrowthPercentage >= 0 ? "↑" : "↓"} ${Math.abs(
      collectionGrowthPercentage
    ).toFixed(1)}% vs last year`,
  },

  monthCollection: {
    value: `Rs.${thisMonthCollection.toLocaleString()}`,
    sub: "Current month collection",
  },

  weeklyAverage: {
    value: `Rs.${Math.round(avgWeeklyAmount).toLocaleString()}`,
    sub: "Average daily this week",
  },

  transactionsCount: {
    value: recentTransactionsData.length.toString(),
    sub: "Latest transactions",
  },
};