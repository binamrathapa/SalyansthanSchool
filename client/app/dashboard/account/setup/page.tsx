"use client";

import { useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import FeeCategoryForm from "./components/FeeCategoryForm";
import AccountHeadForm from "./components/AccountHeadForm";
import AcademicYearForm from "./components/AcademicYearForm"; // Reference component
import { FeeCategory, FeeHead } from "@/app/dashboard/types/account";
import { AcademicYear } from "@/app/dashboard/types/academic-year";
import { showConfirm, showError } from "@/lib/sweet-alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// API Imports
import {
  useGetAllAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear,
} from "@/server-action/api/academic-year-api";

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

// Table Config Imports
import {
  academicYearColumns,
  feeCategoryColumns,
  feeHeadColumns,
} from "@/app/dashboard/config/table/accountSetupTableConfig";
import LoadingWrapper from "../../components/dashboard/common/GlobalLoaderWrapper";

export default function AccountSetupPage() {
  const [activeTab, setActiveTab] = useState("year");

  // --- 0. Academic Year State & Logic ---
  const initialYearState = { name: "", startDate: "", endDate: "", isActive: true };
  const [yearFormData, setYearFormData] = useState(initialYearState);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  const { data: academicYearsData, isLoading: isLoadingYears } = useGetAllAcademicYears();
  const createYear = useCreateAcademicYear();
  const updateYear = useUpdateAcademicYear();
  const deleteYear = useDeleteAcademicYear();

  const handleYearChange = (key: string, value: any) => {
    setYearFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleYearSubmit = async () => {
    if (!yearFormData.name || !yearFormData.startDate || !yearFormData.endDate || !yearFormData.isActive) return;
    try {
      if (editingYear) {
        await updateYear.mutateAsync({ id: editingYear.id, ...yearFormData });
      } else {
        await createYear.mutateAsync(yearFormData);
      }
      setYearFormData(initialYearState);
      setEditingYear(null);
    } catch (error) {
      showError("Failed to save Academic Year");
    }
  };

  // --- 1. Category State & Logic ---
  const [selectedCategory, setSelectedCategory] = useState<FeeCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const { data: categoriesData, isLoading: isLoadingCats } = useGetAllFeeCategories();
  const createCat = useCreateFeeCategory();
  const updateCat = useUpdateFeeCategory();
  const deleteCat = useDeleteFeeCategory();

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

  const academicYears = Array.isArray(academicYearsData) ? academicYearsData : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const accountHeads = Array.isArray(accountHeadsData) ? accountHeadsData : [];

  // --- Shared Styling ---
  const tabTriggerClass = `px-0 pb-2 text-sm font-medium cursor-pointer text-gray-600 hover:text-gray-900 
    data-[state=active]:text-green-600 data-[state=active]:border-b-2 
    data-[state=active]:border-green-600 data-[state=active]:bg-transparent 
    data-[state=active]:shadow-none data-[state=active]:rounded-none 
    data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none 
    data-[state=inactive]:border-0 rounded-none bg-transparent shadow-none border-0`;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Account Setup</h1>
        <p className="text-gray-500">Manage your academic years, fee categories, and account heads.</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="bg-transparent rounded-none h-auto p-0 gap-6 border-0">
          <TabsTrigger value="year" className={tabTriggerClass}>Academic Year</TabsTrigger>
          <TabsTrigger value="category" className={tabTriggerClass}>Fee Category</TabsTrigger>
          <TabsTrigger value="head" className={tabTriggerClass}>Account Head</TabsTrigger>
        </TabsList>

        <hr className="border-gray-200 -mt-[2px]" />

        {/* --- Academic Year Tab --- */}
        <TabsContent value="year" className="mt-6 mb-6">
          <LoadingWrapper isLoading={isLoadingYears}>
            <div className="space-y-12">
              <AcademicYearForm
                data={yearFormData}
                onChange={handleYearChange}
                onSubmit={handleYearSubmit}
                isEditing={Boolean(editingYear)}
                onCancel={() => { setEditingYear(null); setYearFormData(initialYearState); }}
              />
              <CustomTable
                caption="Academic Years List"
                data={academicYears}
                columns={academicYearColumns(
                  (row) => {
                    setEditingYear(row);
                    setYearFormData({
                      name: row.name,
                      startDate: row.startDate.split('T')[0],
                      endDate: row.endDate.split('T')[0],
                      isActive: row.isActive
                    });
                  },
                  async (row) => {
                    const ok = await showConfirm({ title: "Delete Year?", text: `Delete ${row.name}?` });
                    if (ok) deleteYear.mutateAsync(row.id);
                  }
                )}
                isLoading={isLoadingYears}
                searchableKeys={["name"]}
              />
            </div>
          </LoadingWrapper>
        </TabsContent>

        {/* --- Fee Category Tab --- */}
        <TabsContent value="category" className="mt-6 mb-6">
          <LoadingWrapper isLoading={isLoadingCats}>
            <div className="space-y-12">
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
            </div>
          </LoadingWrapper>
        </TabsContent>

        {/* --- Account Head Tab --- */}
        <TabsContent value="head" className="mt-6 mb-6">
          <LoadingWrapper isLoading={isLoadingHeads}>
            <div className="space-y-12">
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
            </div>
          </LoadingWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}