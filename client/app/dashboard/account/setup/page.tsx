"use client";

import { useState } from "react";
import CustomTable, {
  Column,
} from "@/app/dashboard/components/dashboard/common/CustomTable";
import AccountHeadForm from "./components/account-head-form";
import PaymentMode from "./components/payment-mode";
import { accountHeadColumns } from "./config/account-head-table";

interface AccountHead {
  name: string;
  type: string;
  status: string;
}

export default function AccountSetupPage() {
  const [data, setData] = useState<AccountHead[]>([
    { name: "Tuition Fee", type: "Income", status: "Active" },
    { name: "Exam Fee", type: "Income", status: "Active" },
    { name: "Stationery", type: "Expense", status: "Active" },
  ]);

  const handleAdd = (head: AccountHead) => {
    setData((prev) => [...prev, head]);
  };

  const handleDelete = (rows: AccountHead[]) => {
    setData((prev) => prev.filter((item) => !rows.includes(item)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Account Setup</h1>
        <p className="text-sm text-muted-foreground">
          Configure account heads and payment modes
        </p>
      </div>

      {/* Add Account Head Form */}
      <AccountHeadForm onAdd={handleAdd} />

      {/* Account Heads Table */}
      <CustomTable
        caption="Account Heads"
        columns={accountHeadColumns}
        data={data}
        onDelete={handleDelete}
        searchableKeys={["name", "type"]}
      />

      {/* Payment Modes */}
      <PaymentMode />
    </div>
  );
}
