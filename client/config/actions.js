import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const defaultActions = [
  {
    label: "View",
    icon: FiEye,
    onClick: (row) => alert("View " + row.id),
    className: "text-[#67483D]",
  },
  {
    label: "Edit",
    icon: FiEdit,
    onClick: (row) => alert("Edit " + row.id),
    className: "text-[#419544]",
  },
  {
    label: "Delete",
    icon: FiTrash2,
    onClick: (row) => alert("Delete " + row.id),
    className: "text-red-600",
  },
];

export default defaultActions;
