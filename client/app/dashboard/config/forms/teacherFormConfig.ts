export interface TeacherFieldConfig {
  name:
    | "name"
    | "subject"
    | "qualification"
    | "designation"
    | "experience"
    | "dob"
    | "joiningDate"
    | "address"
    | "contact"
    | "panNumber"
    | "nidNumber"
    | "citizenshipNumber"
    | "gender";
  label: string;
  type?: "text" | "date" | "select";
  restrictInput?: RegExp;
  options?: string[];
}

export const teacherFieldConfig: TeacherFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    restrictInput: /[^a-zA-Z\s]/g,
  },
  {
    name: "subject",
    label: "Subject",
  },
  {
    name: "qualification",
    label: "Qualification",
  },
  {
    name: "designation",
    label: "Designation",
  },
  {
    name: "experience",
    label: "Experience (Years)",
    restrictInput: /\D/g,
  },
  {
    name: "dob",
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
    name: "contact",
    label: "Contact Number",
    restrictInput: /\D/g,
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
    name: "citizenshipNumber",
    label: "Citizenship Number",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
];
