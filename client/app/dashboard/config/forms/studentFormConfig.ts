export interface StudentFieldConfig {
  name:
    | "name"
    | "gradeId"
    | "sectionId"
    | "rollNo"
    | "parent"
    | "parentContact"
    | "address"
    | "dob"
    | "admissionDate"
    | "gender"
    | "bloodGroup";
  label: string;
  type?: "text" | "date" | "select";
  restrictInput?: RegExp;
}

export const studentFieldConfig: StudentFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    restrictInput: /[^a-zA-Z\s]/g,
  },
  {
    name: "gradeId",
    label: "Grade",
    type: "select",
  },
  {
    name: "sectionId",
    label: "Section",
    type: "select",
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
    name: "bloodGroup",
    label: "Blood Group",
    type: "select",
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
  },
];
