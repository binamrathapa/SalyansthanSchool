import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { FeeHead } from "@/app/dashboard/types/account";
export const feeHeadColumns: Column<FeeHead>[] = [
  {
    key: "sn",
    label: "S.N",
    render: (_row, idx) => idx + 1,
  },
  { key: "name", label: "Account Head", exportable: true },
  { key: "feeCategoryName", label: "Category", exportable: true },
  {
    key: "createdAt",
    label: "Created At",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

/* ================= SEARCHABLE KEYS ================= */

export const feeHeadSearchableKeys: (keyof FeeHead)[] = [
  "name",
  "feeCategoryName",
];