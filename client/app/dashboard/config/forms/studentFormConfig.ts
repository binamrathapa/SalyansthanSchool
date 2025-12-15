export interface StudentFieldConfig {
  name:
    | "name"
    | "grade"
    | "rollNo"
    | "parent"  
    | "parentContact"
    | "address"
    | "dob"
    | "admissionDate"
    | "gender"
    ;
  label: string;
  type?: "text" | "date" | "select";
  options?: string[];
  restrictInput?: RegExp;
}

export const studentFieldConfig: StudentFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    restrictInput: /[^a-zA-Z\s]/g,
  },
  {
    name: "grade",
    label: "Grade",
  },
  {
    name: "rollNo",
    label: "Roll No",
    restrictInput: /\D/g,
  },
  {
    name: "parent",
    label: "Parent Name",
    restrictInput: /[^a-zA-Z\s]/g,
  },
  {
    name: "parentContact",
    label: "Parent Contact",
    restrictInput: /\D/g,
  },
  {
    name: "address",
    label: "Address",
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
