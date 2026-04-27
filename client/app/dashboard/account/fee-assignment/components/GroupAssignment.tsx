"use client";

import { useState, useMemo } from "react";
import FeeStructureForm from "../../setup/components/FeeStructureForm";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { feeStructureColumns } from "@/app/dashboard/config/table/accountSetupTableConfig";
import { showConfirm, showError } from "@/lib/sweet-alert";
import LoadingWrapper from "@/app/dashboard/components/dashboard/common/GlobalLoaderWrapper";
import {
  useGetAllFeeStructures,
  useCreateFeeStructure,
  useUpdateFeeStructure,
  useDeleteFeeStructure,
} from "@/server-action/api/fee-structure.api";
import { useGetAllAcademicYears } from "@/server-action/api/academic-year-api";
import { useGetAllGrades } from "@/server-action/api/grade.api";
import { useGetAllFeeHeads } from "@/server-action/api/feeHead";
import { FeeStructure } from "@/app/dashboard/types/fee-structure";
import { AssignmentData } from "../types";

interface GroupAssignmentProps {
  data: AssignmentData;
  onAssign: (payload: any) => void;
}

export default function GroupAssignment({ data }: GroupAssignmentProps) {
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);

  const { data: structuresData, isLoading: isLoadingStructures } = useGetAllFeeStructures();
  const { data: academicYearsData } = useGetAllAcademicYears();
  const { data: gradesData } = useGetAllGrades();
  const { data: accountHeadsData } = useGetAllFeeHeads();

  const createStruct = useCreateFeeStructure();
  const updateStruct = useUpdateFeeStructure();
  const deleteStruct = useDeleteFeeStructure();

  const academicYears = Array.isArray(academicYearsData) ? academicYearsData : [];
  const accountHeads = Array.isArray(accountHeadsData) ? accountHeadsData : [];
  const structures = Array.isArray(structuresData) ? structuresData : [];
  const grades = Array.isArray(gradesData) ? gradesData : [];

  const structureInitialValues = useMemo(() => ({
    academicYearId: editingStructure?.academicYearId || 0,
    gradeId: editingStructure?.gradeId || 0,
    feeHeadId: editingStructure?.feeHeadId || 0,
    amount: editingStructure?.amount || 0,
    isMonthly: editingStructure?.isMonthly ?? true,
  }), [editingStructure]);

  const handleStructureSubmit = async (values: any) => {
    try {
      if (editingStructure) {
        await updateStruct.mutateAsync({ id: editingStructure.id, ...values });
      } else {
        await createStruct.mutateAsync(values);
      }
      setEditingStructure(null);
    } catch (error: any) {
      showError(error || "Something went wrong while saving the fee structure.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Manage Fee Structures</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Define and manage fee structures for different classes and academic years.
        </p>
      </div>

      <LoadingWrapper isLoading={isLoadingStructures}>
        <div className="px-7 py-6 space-y-10">

          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {editingStructure ? "Edit Structure" : "New Structure"}
            </h4>
            <FeeStructureForm
              key={editingStructure ? `edit-${editingStructure.id}` : "new-structure"}
              initialValues={structureInitialValues}
              academicYears={academicYears}
              grades={grades}
              feeHeads={accountHeads}
              onSubmit={handleStructureSubmit}
              submitLabel={editingStructure ? "Update Structure" : "Save Structure"}
              onCancel={() => setEditingStructure(null)}
            />
          </section>

          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Fee Structures List
            </h4>
            <CustomTable
              caption="Fee Structures List"
              data={structures}
              columns={feeStructureColumns(
                (row) => {
                  const year = academicYears.find(y => y.name === row.academicYearName);
                  const grade = grades.find(g => g.name === row.gradeName);
                  const head = accountHeads.find(h => h.name === row.feeHeadName);
                  setEditingStructure({
                    ...row,
                    academicYearId: row.academicYearId || year?.id || 0,
                    gradeId: row.gradeId || grade?.id || 0,
                    feeHeadId: row.feeHeadId || head?.id || 0,
                  });
                },
                async (row) => {
                  const confirmed = await showConfirm({ title: "Delete?", text: "Delete this structure?" });
                  if (confirmed) await deleteStruct.mutateAsync(row.id);
                }
              )}
              isLoading={isLoadingStructures}
              searchableKeys={["gradeName", "feeHeadName"]}
            />
          </section>

        </div>
      </LoadingWrapper>
    </div>
  );
}