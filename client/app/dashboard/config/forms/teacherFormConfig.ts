export interface TeacherFieldConfig {
  name:
  | "firstName"
  | "middleName"
  | "lastName"
  | "qualification"
  | "dateOfBirth"
  | "joiningDate"
  | "address"
  | "mobileNo"
  | "email"
  | "panNumber"
  | "nidNumber"
  | "gender";
  label: string;
  type?: "text" | "date" | "select" | "email";
  restrictInput?: RegExp;
  options?: string[];
}

export const teacherFieldConfig: TeacherFieldConfig[] = [
  {
    name: "firstName",
    label: "First Name",
    restrictInput: /[^a-zA-Z\s]/g,
  },
  {
    name: "middleName",
    label: "Middle Name",
    restrictInput: /[^a-zA-Z\s]/g,
  },
  {
    name: "lastName",
    label: "Last Name",
    restrictInput: /[^a-zA-Z\s]/g,
  },
  {
    name: "qualification",
    label: "Qualification",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "joiningDate",
    label: "Joining Date",
    type: "date",
  },
  {
    name: "address",
    label: "Address",
  },
  {
    name: "mobileNo",
    label: "Mobile Number",
    restrictInput: /\D/g,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "panNumber",
    label: "PAN Number",
  },
  {
    name: "nidNumber",
    label: "NID Number",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
];
