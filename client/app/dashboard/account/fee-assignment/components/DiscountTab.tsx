"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useGetAllDiscounts,
  useCreateDiscount,
  useDeleteDiscount,
  useToggleDiscountStatus,
} from "@/server-action/api/discount.api";
import { useGetAllStudents } from "@/server-action/api/student.api";
import { useGetAllFeeHeads } from "@/server-action/api/feeHead";
import { useGetAllAcademicYears } from "@/server-action/api/academic-year-api";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { discountColumns } from "@/app/dashboard/config/table/discountTableConfig";
import { StudentDiscount, StudentDiscountPayload } from "@/app/dashboard/types/discount";
import { showSuccess, showError, showConfirm } from "@/lib/sweet-alert";

export default function DiscountTab() {
  const [formData, setFormData] = useState<StudentDiscountPayload>({
    studentId: 0,
    feeHeadId: 0,
    academicYearId: 0,
    discountValue: 0,
    isPercentage: false,
    maxDiscountAmount: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
  });

  const { data: students = [] } = useGetAllStudents();
  const { data: feeHeads = [] } = useGetAllFeeHeads();
  const { data: academicYears = [] } = useGetAllAcademicYears();
  const { data: discounts = [], isLoading } = useGetAllDiscounts();

  const createMutation = useCreateDiscount();
  const deleteMutation = useDeleteDiscount();
  const toggleMutation = useToggleDiscountStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.feeHeadId || !formData.academicYearId) {
      showError("Please fill all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      showSuccess("Discount created successfully");
      setFormData({
        ...formData,
        studentId: 0,
        discountValue: 0,
      });
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to create discount");
    }
  };

  const handleDelete = async (row: StudentDiscount) => {
    const isConfirmed = await showConfirm({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      confirmButtonText: "Yes, delete it!",
    });

    if (isConfirmed) {
      try {
        await deleteMutation.mutateAsync(row.id);
        showSuccess("Discount deleted successfully");
      } catch (error: any) {
        showError("Failed to delete discount");
      }
    }
  };

  const handleToggle = async (row: StudentDiscount) => {
    try {
      await toggleMutation.mutateAsync(row.id);
      showSuccess(`Discount ${row.isActive ? "deactivated" : "activated"} successfully`);
    } catch (error: any) {
      showError("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Creation Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add New Discount</h3>
            <p className="text-sm text-slate-500">Apply a fee concession for a specific student</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl">
          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Student</Label>
            <div className="flex-1">
              <Select
                value={formData.studentId?.toString() || ""}
                onValueChange={(val) => setFormData({ ...formData, studentId: Number(val) })}
              >
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s: any) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.fullName || s.name} ({s.rollNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Fee Head</Label>
            <div className="flex-1">
              <Select
                value={formData.feeHeadId?.toString() || ""}
                onValueChange={(val) => setFormData({ ...formData, feeHeadId: Number(val) })}
              >
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select Fee Head" />
                </SelectTrigger>
                <SelectContent>
                  {feeHeads.map((f: any) => (
                    <SelectItem key={f.id} value={f.id.toString()}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Academic Year</Label>
            <div className="flex-1">
              <Select
                value={formData.academicYearId?.toString() || ""}
                onValueChange={(val) => setFormData({ ...formData, academicYearId: Number(val) })}
              >
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y: any) => (
                    <SelectItem key={y.id} value={y.id.toString()}>
                      {y.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Discount Value</Label>
            <div className="flex-1">
              <Input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                placeholder="Amount or %"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Valid From</Label>
            <div className="flex-1">
              <Input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Valid To</Label>
            <div className="flex-1">
              <Input
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Is Percentage</Label>
            <div className="flex items-center gap-2">
              <Switch
                id="isPercentage"
                checked={formData.isPercentage}
                onCheckedChange={(checked) => setFormData({ ...formData, isPercentage: checked })}
              />
              <span className="text-sm text-slate-500">{formData.isPercentage ? "Yes (%)" : "No (Rs.)"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32 shrink-0 text-slate-600 font-semibold">Max Amount</Label>
            <div className="flex-1">
              <Input
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                placeholder="Max Rs. (Optional)"
                disabled={!formData.isPercentage}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="px-10 h-11 rounded-xl bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
            >
              {createMutation.isPending ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </form>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Tag size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Discounts</h3>
              <p className="text-sm text-slate-500">List of all currently assigned concessions</p>
            </div>
          </div>
        </div>

        <CustomTable
          columns={discountColumns(handleDelete, handleToggle)}
          data={discounts}
          isLoading={isLoading}
          caption="A list of student discounts."
          showSearch={true}
          searchPlaceholder="Search by student name..."
          searchableKeys={["studentName", "feeHeadName"]}
        />
      </div>
    </div>
  );
}
