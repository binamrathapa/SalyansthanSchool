"use client";

import { useState, useMemo, useEffect } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import FeeCategoryForm from "./components/FeeCategoryForm";
import AccountHeadForm from "./components/AccountHeadForm";
import FeeStructureForm from "./components/FeeStructureForm";
import { FeeCategory, FeeHead } from "@/app/dashboard/types/account";
import { FeeStructure } from "@/app/dashboard/types/fee-structure";
import { showConfirm, showError } from "@/lib/sweet-alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// API Imports
import {
  useGetAllFeeCategories,
  useCreateFeeCategory,
  useUpdateFeeCategory,
  useDeleteFeeCategory,
} from "@/server-action/api/account-category.api";

import {
  useGetAllFeeHeads,
  useCreateFeeHead,
  useUpdateFeeHead,
  useDeleteFeeHead,
} from "@/server-action/api/feeHead";

import {
  useGetAllFeeStructures,
  useCreateFeeStructure,
  useUpdateFeeStructure,
  useDeleteFeeStructure,
} from "@/server-action/api/fee-structure.api";

import { useGetAllAcademicYears } from "@/server-action/api/academic-year-api";
import { useGetAllGrades } from "@/server-action/api/grade.api";

// Table Config Imports
import {
  feeCategoryColumns,
  feeHeadColumns,
  feeStructureColumns,
} from "@/app/dashboard/config/table/accountSetupTableConfig";

export default function AccountSetupPage() {
  const [activeTab, setActiveTab] = useState("category");

  // --- 1. Category State & Logic ---
  const [selectedCategory, setSelectedCategory] = useState<FeeCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");



  const { data: categoriesData, isLoading: isLoadingCats } = useGetAllFeeCategories();
  const createCat = useCreateFeeCategory();
  const updateCat = useUpdateFeeCategory();
  const deleteCat = useDeleteFeeCategory();

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const handleCategorySubmit = async () => {
    if (!categoryName.trim()) return;
    if (selectedCategory) {
      await updateCat.mutateAsync({ id: selectedCategory.id, name: categoryName });
    } else {
      await createCat.mutateAsync({ name: categoryName });
    }
    setCategoryName("");
    setSelectedCategory(null);
  };

  // --- 2. Account Head State & Logic ---
  const [editingHead, setEditingHead] = useState<FeeHead | null>(null);
  const [accountHeadName, setAccountHeadName] = useState("");
  const [selectedFeeCategoryId, setSelectedFeeCategoryId] = useState("");

  const { data: accountHeadsData, isLoading: isLoadingHeads } = useGetAllFeeHeads();
  const createHead = useCreateFeeHead();
  const updateHead = useUpdateFeeHead();
  const deleteHead = useDeleteFeeHead();

  const accountHeads = Array.isArray(accountHeadsData) ? accountHeadsData : [];

  const handleAccountHeadSubmit = async () => {
    if (!accountHeadName.trim() || !selectedFeeCategoryId) return;
    if (editingHead) {
      await updateHead.mutateAsync({
        id: editingHead.id,
        name: accountHeadName,
        feeCategoryId: Number(selectedFeeCategoryId),
      });
    } else {
      await createHead.mutateAsync({
        name: accountHeadName,
        feeCategoryId: Number(selectedFeeCategoryId),
      });
    }
    setAccountHeadName("");
    setSelectedFeeCategoryId("");
    setEditingHead(null);
  };

  // --- 3. Fee Structure State & Logic ---
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);

  const { data: structuresData, isLoading: isLoadingStructures } = useGetAllFeeStructures();
  const { data: academicYearsData } = useGetAllAcademicYears();
  const { data: gradesData } = useGetAllGrades();

  const createStruct = useCreateFeeStructure();
  const updateStruct = useUpdateFeeStructure();
  const deleteStruct = useDeleteFeeStructure();

  const structures = Array.isArray(structuresData) ? structuresData : [];
  const academicYears = Array.isArray(academicYearsData) ? academicYearsData : [];
  const grades = Array.isArray(gradesData) ? gradesData : [];

  console.log("edit", editingStructure)
  const structureInitialValues = useMemo(() => ({
  academicYearId: editingStructure?.academicYearId || 0,
  gradeId: editingStructure?.gradeId || 0,
  feeHeadId: editingStructure?.feeHeadId || 0,
  amount: editingStructure?.amount || 0,
  isMonthly: editingStructure?.isMonthly ?? true,
}), [editingStructure])

  const handleStructureSubmit = async (values: any) => {
    try {
      if (editingStructure) {
        await updateStruct.mutateAsync({
          id: editingStructure.id,
          ...values
        });
      } else {
        await createStruct.mutateAsync(values);
      }
      setEditingStructure(null);
    } catch (error: any) {
      showError(error || "Something went wrong while saving the fee structure.");
    }
  };

  const handleStructureDelete = async (row: FeeStructure) => {
    const confirmed = await showConfirm({
      title: "Delete Fee Structure?",
      text: `Are you sure you want to delete this structure for Grade ${row.gradeName}?`,
      confirmButtonText: "Delete",
    });
    if (confirmed) await deleteStruct.mutateAsync(row.id);
  };

  // --- Shared Styling ---
  const tabTriggerClass = `px-0 pb-2 text-sm font-medium text-gray-600 hover:text-gray-900 
    data-[state=active]:text-green-600 data-[state=active]:border-b-2 
    data-[state=active]:border-green-600 data-[state=active]:bg-transparent 
    data-[state=active]:shadow-none data-[state=active]:rounded-none 
    data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none 
    data-[state=inactive]:border-0 rounded-none bg-transparent shadow-none border-0`;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Account Setup</h1>
        <p className="text-gray-500">Manage your fee categories, account heads, and grade-wise fee structures.</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent rounded-none h-auto p-0 gap-6 border-0">
          <TabsTrigger value="category" className={tabTriggerClass}>Fee Category</TabsTrigger>
          <TabsTrigger value="head" className={tabTriggerClass}>Account Head</TabsTrigger>
          <TabsTrigger value="structure" className={tabTriggerClass}>Fee Structure</TabsTrigger>
        </TabsList>

        <hr className="border-gray-200 -mt-[2px]" />

        {/* --- Fee Category Tab --- */}
        <TabsContent value="category" className="mt-6 space-y-4">
          <FeeCategoryForm
            name={categoryName}
            selected={selectedCategory}
            loading={createCat.isPending || updateCat.isPending}
            onNameChange={setCategoryName}
            onSubmit={handleCategorySubmit}
            isEditing={Boolean(selectedCategory)}
            onCancel={() => { setSelectedCategory(null); setCategoryName(""); }}
          />
          <CustomTable
            caption="Fee Categories List"
            data={categories}
            columns={feeCategoryColumns(
              (row) => { setSelectedCategory(row); setCategoryName(row.name); },
              async (row) => {
                const ok = await showConfirm({ title: "Delete Category?", text: `Delete ${row.name}?` });
                if (ok) deleteCat.mutateAsync(row.id);
              }
            )}
            isLoading={isLoadingCats}
            searchableKeys={["name"]}
          />
        </TabsContent>

        {/* --- Account Head Tab --- */}
        <TabsContent value="head" className="mt-6 space-y-4">
          <AccountHeadForm
            name={accountHeadName}
            feeCategoryId={selectedFeeCategoryId}
            categories={categories}
            loading={createHead.isPending || updateHead.isPending}
            onNameChange={setAccountHeadName}
            onCategoryChange={setSelectedFeeCategoryId}
            onSubmit={handleAccountHeadSubmit}
            isEditing={Boolean(editingHead)}
            onCancel={() => { setEditingHead(null); setAccountHeadName(""); setSelectedFeeCategoryId(""); }}
          />
          <CustomTable
            caption="Account Heads List"
            data={accountHeads}
            columns={feeHeadColumns(
              (row) => { setEditingHead(row); setAccountHeadName(row.name); setSelectedFeeCategoryId(String(row.feeCategoryId)); },
              async (row) => {
                const ok = await showConfirm({ title: "Delete Head?", text: `Delete ${row.name}?` });
                if (ok) deleteHead.mutateAsync(row.id);
              }
            )}
            isLoading={isLoadingHeads}
            searchableKeys={["name"]}
          />
        </TabsContent>

        {/* --- Fee Structure Tab --- */}
        <TabsContent value="structure" className="mt-6 space-y-4">
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
          <CustomTable
            caption="Fee Structures List"
            data={structures}
            columns={feeStructureColumns(
              (row) => {
                // Find the IDs based on names if they aren't in the row object
                const year = academicYears.find(y => y.name === row.academicYearName);
                const grade = grades.find(g => g.name === row.gradeName);
                const head = accountHeads.find(h => h.name === row.feeHeadName);

                setEditingStructure({
                  ...row,
                  academicYearId: row.academicYearId || year?.id,
                  gradeId: row.gradeId || grade?.id,
                  feeHeadId: row.feeHeadId || head?.id,
                });
              },
              handleStructureDelete
            )}
            isLoading={isLoadingStructures}
            searchableKeys={["gradeName", "feeHeadName"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}