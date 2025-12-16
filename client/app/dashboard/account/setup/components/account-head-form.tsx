"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountHead {
  name: string;
  type: string;
  status: string;
}

interface Props {
  onAdd: (head: AccountHead) => void;
}

export default function AccountHeadForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = () => {
    if (!name || !type) return;

    onAdd({ name, type, status: "Active" });

    setName("");
    setType("");
    console.log("Account Head Added", { name, type });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Account Head</CardTitle>
      </CardHeader>

      <CardContent className="flex gap-3 flex-wrap">
        <Input
          placeholder="Account Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[200px]"
        />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit}>Add</Button>
      </CardContent>
    </Card>
  );
}
