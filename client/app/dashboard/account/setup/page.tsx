"use client";

import { useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import FeeCategoryForm from "./components/FeeCategoryForm";
import AccountHeadForm from "./components/AccountHeadForm";
import { FeeCategory, FeeHead } from "@/app/dashboard/types/account";
import { showConfirm } from "@/lib/sweet-alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  feeCategoryColumns,
  feeHeadColumns,
} from "@/app/dashboard/config/table/accountSetupTableConfig";

export default function AccountSetupPage() {
  const [selectedCategory, setSelectedCategory] = useState<FeeCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingHead, setEditingHead] = useState<FeeHead | null>(null);
  const [accountHeadName, setAccountHeadName] = useState("");
  const [selectedFeeCategoryId, setSelectedFeeCategoryId] = useState("");
  const [activeTab, setActiveTab] = useState("category");

  const { data: categoriesData, isLoading: isLoadingCats } = useGetAllFeeCategories();
  const { data: accountHeadsData, isLoading: isLoadingHeads } = useGetAllFeeHeads();

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const accountHeads = Array.isArray(accountHeadsData) ? accountHeadsData : [];

  const createCat = useCreateFeeCategory();
  const updateCat = useUpdateFeeCategory();
  const deleteCat = useDeleteFeeCategory();

  const createHead = useCreateFeeHead();
  const updateHead = useUpdateFeeHead();
  const deleteHead = useDeleteFeeHead();

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

  const handleCategoryEdit = (row: FeeCategory) => {
    setSelectedCategory(row);
    setCategoryName(row.name);
    setActiveTab("category");
  };

  const handleCategoryDelete = async (row: FeeCategory) => {
    const confirmed = await showConfirm({
      title: "Delete Category?",
      text: `Are you sure you want to delete ${row.name}?`,
      confirmButtonText: "Delete",
    });
    if (confirmed) await deleteCat.mutateAsync(row.id);
  };

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

  const handleAccountHeadEdit = (row: FeeHead) => {
    setEditingHead(row);
    setAccountHeadName(row.name);
    setSelectedFeeCategoryId(String(row.feeCategoryId));
    setActiveTab("head");
  };

  const handleAccountHeadDelete = async (row: FeeHead) => {
    const confirmed = await showConfirm({
      title: "Delete Account Head?",
      text: `Are you sure you want to delete ${row.name}?`,
      confirmButtonText: "Delete",
    });
    if (confirmed) await deleteHead.mutateAsync(row.id);
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Account Setup</h1>
        <p className="text-gray-500">Manage your fee categories and account heads.</p>
      </header>

      {/* Tabbed navigation like your screenshot */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent rounded-none h-auto p-0 gap-6 border-0">
          <TabsTrigger
            value="category"
            className="px-0 pb-2 text-sm font-medium text-gray-600 hover:text-gray-900
               data-[state=active]:text-green-600
               data-[state=active]:border-b-2
               data-[state=active]:border-green-600
               data-[state=active]:bg-transparent
               data-[state=active]:shadow-none
               data-[state=active]:rounded-none
               data-[state=inactive]:bg-transparent
               data-[state=inactive]:shadow-none
               data-[state=inactive]:border-0
               rounded-none bg-transparent shadow-none border-0"
          >
            Fee Category
          </TabsTrigger>

          <TabsTrigger
            value="head"
            className="px-0 pb-2 text-sm font-medium text-gray-600 hover:text-gray-900
               data-[state=active]:text-green-600
               data-[state=active]:border-b-2
               data-[state=active]:border-green-600
               data-[state=active]:bg-transparent
               data-[state=active]:shadow-none
               data-[state=active]:rounded-none
               data-[state=inactive]:bg-transparent
               data-[state=inactive]:shadow-none
               data-[state=inactive]:border-0
               rounded-none bg-transparent shadow-none border-0"
          >
            Account Head
          </TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="mt-4 space-y-4">
          <FeeCategoryForm
            name={categoryName}
            selected={selectedCategory}
            loading={createCat.isPending || updateCat.isPending}
            onNameChange={setCategoryName}
            onSubmit={handleCategorySubmit}
            isEditing={Boolean(selectedCategory)}
            onCancel={() => {
              setSelectedCategory(null);
              setCategoryName("");
            }}
          />
          <CustomTable
            caption="Fee Categories List"
            data={categories}
            columns={feeCategoryColumns(handleCategoryEdit, handleCategoryDelete)}
            isLoading={isLoadingCats}
            searchableKeys={["name"]}
          />
        </TabsContent>

        <TabsContent value="head" className="mt-4 space-y-4">
          <AccountHeadForm
            name={accountHeadName}
            feeCategoryId={selectedFeeCategoryId}
            categories={categories}
            loading={createHead.isPending || updateHead.isPending}
            onNameChange={setAccountHeadName}
            onCategoryChange={setSelectedFeeCategoryId}
            onSubmit={handleAccountHeadSubmit}
            isEditing={Boolean(editingHead)}
            onCancel={() => {
              setEditingHead(null);
              setAccountHeadName("");
              setSelectedFeeCategoryId("");
            }}
          />
          <CustomTable
            caption="Account Heads List"
            data={accountHeads}
            columns={feeHeadColumns(handleAccountHeadEdit, handleAccountHeadDelete)}
            isLoading={isLoadingHeads}
            searchableKeys={["name", "feeCategoryName"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}