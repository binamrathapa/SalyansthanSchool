// src/config/studentFormConfig.ts
export interface StudentFieldConfig {
  name: string;
  label: string;
  type?: "text" | "date" | "select";
  options?: string[];
  restrictInput?: RegExp;
}

export const studentFieldConfig: StudentFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    restrictInput: /[^a-zA-Z\s]/g, // only letters and spaces
  },
  {
    name: "grade",
    label: "Grade",
    type: "text",
  },
  {
    name: "rollNo",
    label: "Roll No",
    type: "text",
    restrictInput: /\D/g, // only numbers
  },
  {
    name: "parent",
    label: "Parent Name",
    type: "text",
    restrictInput: /[^a-zA-Z\s]/g, // only letters and spaces
  },
  {
    name: "address",
    label: "Address",
    type: "text",
  },
  {
    name: "parentContact",
    label: "Parent Contact",
    type: "text",
    restrictInput: /\D/g, // only numbers
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "admissionDate",
    label: "Admission Date",
    type: "date",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
];
