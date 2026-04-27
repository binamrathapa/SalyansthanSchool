"use client";

import { User, Users, CalendarDays, Wallet, BadgeDollarSign, Receipt, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPhotoUrl } from "@/server-action/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AssignmentPreviewProps {
    title: string;
    type: "individual" | "group" | "billing";
    targetName: string;
    subDetails: { label: string; value: string }[];
    selectedStructures: { id: number; feeHead: string; amount: number; type: string }[];
    totalAmount: number;
    onAssign: () => void;
    isPending?: boolean;
    canAssign?: boolean;
    onDeselect?: () => void;
    student?: {
        fullName: string;
        photo?: string | null;
        id: number;
        gradeName?: string | null;
        sectionName?: string | null;
        rollNo?: number;
        gender?: string | null;
        dateOfBirth?: string | null;
        guardianName?: string | null;
        guardianContact?: string | null;
        address?: string | null;
    };
    customItems?: { feeHeadName: string; feeCategoryName: string; amount: number }[];
    grandTotal?: number;
}

const moneyFormatter = (amount: number) => `Rs. ${amount.toLocaleString()}`;

export default function AssignmentPreview({
    title,
    type,
    targetName,
    subDetails,
    selectedStructures,
    totalAmount,
    onAssign,
    isPending,
    canAssign,
    student,
    onDeselect,
    customItems = [],
    grandTotal,
}: AssignmentPreviewProps) {
    const Icon = type === "individual" ? User : type === "group" ? Users : CalendarDays;
    const gradient = "from-green-500 to-green-700";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md shadow-green-100 shrink-0`}>
                        <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{title}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Assignment Summary</p>
                    </div>
                </div>
            </div>
            {type === "individual" && student && (
                <div className="p-4 bg-white ">
                    <div className="flex gap-4">
                        {/* Photo (Passport style) */}
                        <div className="w-16 h-20 border rounded-md overflow-hidden bg-slate-100 shrink-0">
                            {student.photo ? (
                                <img
                                    src={getPhotoUrl(student.photo)}
                                    alt={student.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                    No Photo
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Name */}
                            <h5 className="text-sm font-semibold text-slate-900 truncate mb-2">
                                {student.fullName || "Unknown"}
                            </h5>

                            {/* Two Column Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div>
                                    <p className="text-slate-400">Gender</p>
                                    <p className="text-slate-700">{student.gender || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400">DOB</p>
                                    <p className="text-slate-700">{student.dateOfBirth || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400">Parent</p>
                                    <p className="text-slate-700 truncate">
                                        {student.guardianName || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400">Phone</p>
                                    <p className="text-slate-700">
                                        {student.guardianContact || "N/A"}
                                    </p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-slate-400">Address</p>
                                    <p className="text-slate-700 truncate">
                                        {student.address || "No address"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-5 flex-1 space-y-5 overflow-y-auto">
                <div className="space-y-3">
                    {type !== "individual" && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Target</span>
                            <span className="font-bold text-slate-900">{targetName || "-"}</span>
                        </div>
                    )}
                    {subDetails.map((detail, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">{detail.label}</span>
                            <span className="font-bold text-slate-800">{detail.value}</span>
                        </div>
                    ))}
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900">Total Amount</span>
                        <span className="text-xl font-black text-green-600 tabular-nums">{moneyFormatter(grandTotal ?? totalAmount)}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Included Structures</h5>
                    {selectedStructures.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-xs text-slate-400 italic">No structures selected</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {selectedStructures.map((item) => (
                                <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-slate-800">{item.feeHead}</span>
                                        <span className="text-sm font-bold text-slate-900">{moneyFormatter(item.amount)}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">{item.type}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {customItems.length > 0 && (
                    <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Custom Items</h5>
                        <div className="space-y-2">
                            {customItems.map((item, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-amber-50 border border-amber-100 transition-all">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-slate-800">{item.feeHeadName}</span>
                                        <span className="text-sm font-bold text-amber-700">{moneyFormatter(item.amount)}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">{item.feeCategoryName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/30">
                <Button
                    onClick={onAssign}
                    disabled={isPending || (canAssign !== undefined ? !canAssign : (selectedStructures.length === 0 || !targetName))}
                    className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 h-11 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isPending ? "Assigning..." : `Assign to ${type === "individual" ? "Student" : type === "group" ? "Group" : "Billing cycle"}`}
                </Button>
            </div>
        </div>
    );
}
