import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";

export interface AccountHead {
  name: string;
  type: string;
  status: string;
}
export const accountHeadColumns: Column<AccountHead>[] = [
  {
    key: "sn",
    label: "S.N",
    render: (_row, idx) => idx + 1,
  },
  { key: "name", label: "Name", exportable: true },
  { key: "type", label: "Type", exportable: true },
  { key: "status", label: "Status", exportable: true },
];

export const searchableKeys: (keyof AccountHead)[] = ["name", "type"];
