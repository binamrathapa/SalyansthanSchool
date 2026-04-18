"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { FeeStructurePayload } from "@/app/dashboard/types/fee-structure";

interface FeeStructureFormProps {
    initialValues: FeeStructurePayload;
    academicYears: { id: number; name: string }[];
    grades: { id: number; name: string }[];
    feeHeads: { id: number; name: string }[];
    onSubmit: (values: FeeStructurePayload) => void | Promise<void>;
    submitLabel?: string;
    onCancel: () => void
    disabled?: boolean;
}

export default function FeeStructureForm({
    initialValues,
    academicYears,
    grades,
    feeHeads,
    onSubmit,
    submitLabel = "Save Structure",
    disabled = false,
}: FeeStructureFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FeeStructurePayload>({
        defaultValues: initialValues,
    });


    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Academic Year Select */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Academic Year</label>
                    <Controller
                        name="academicYearId"
                        control={control}
                        rules={{ required: "Academic year is required" }}
                        render={({ field }) => (
                            <Select
                                disabled={disabled}
                                value={field.value?.toString()}
                                onValueChange={(val) => field.onChange(Number(val))}
                            >
                                <SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:ring-green-500">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((year) => (
                                        <SelectItem key={year.id} value={year.id.toString()}>
                                            {year.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.academicYearId && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.academicYearId.message}
                        </p>
                    )}
                </div>

                {/* Grade Select */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Grade</label>
                    <Controller
                        name="gradeId"
                        control={control}
                        rules={{ required: "Grade is required" }}
                        render={({ field }) => (
                            <Select
                                disabled={disabled}
                                value={field.value?.toString()}
                                onValueChange={(val) => field.onChange(Number(val))}
                            >
                                <SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:ring-green-500">
                                    <SelectValue placeholder="Select Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grades.map((grade) => (
                                        <SelectItem key={grade.id} value={grade.id.toString()}>
                                            {grade.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.gradeId && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.gradeId.message}
                        </p>
                    )}
                </div>

                {/* Fee Head Select */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Fee Head</label>
                    <Controller
                        name="feeHeadId"
                        control={control}
                        rules={{ required: "Fee head is required" }}
                        render={({ field }) => (
                            <Select
                                disabled={disabled}
                                value={field.value?.toString()}
                                onValueChange={(val) => field.onChange(Number(val))}
                            >
                                <SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:ring-green-500">
                                    <SelectValue placeholder="Select Fee Head" />
                                </SelectTrigger>
                                <SelectContent>
                                    {feeHeads.map((head) => (
                                        <SelectItem key={head.id} value={head.id.toString()}>
                                            {head.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.feeHeadId && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.feeHeadId.message}
                        </p>
                    )}
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Amount</label>
                    <Input
                        type="number"
                        step="0.01"
                        className="bg-white text-slate-900 border-slate-200 focus-visible:ring-green-500"
                        {...register("amount", {
                            required: "Amount is required",
                            min: { value: 1, message: "Amount must be greater than 0" },
                            valueAsNumber: true
                        })}
                        disabled={disabled}
                        placeholder="0.00"
                    />
                    {errors.amount && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.amount.message}
                        </p>
                    )}
                </div>

                {/* Monthly Switch */}
                <div className="flex items-center gap-3 pt-8">
                    <Controller
                        name="isMonthly"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="isMonthly"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={disabled}
                            />
                        )}
                    />
                    <label htmlFor="isMonthly" className="text-sm font-semibold text-slate-700 cursor-pointer">
                        Is Monthly Fee?
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                    type="submit"
                    disabled={isSubmitting || disabled}
                    className="bg-green-600 hover:bg-green-700 text-white px-10"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}