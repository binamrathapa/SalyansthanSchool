import { Student } from "@/app/dashboard/config/studentTableConfig";

const images = ["/students/student1.jpg", "/students/student2.jpg"];

export const students: Student[] = [
  { photo: images[0], name: "Yujan Rai", grade: "10th", rollNo: "001", parent: "Sudip" },
  { photo: images[1], name: "Anita Sharma", grade: "9th", rollNo: "002", parent: "Sudip" },
  { photo: images[0], name: "Sanjay Thapa", grade: "10th", rollNo: "003", parent: "Maya" },
  { photo: images[1], name: "Priya Rai", grade: "9th", rollNo: "004", parent: "Ramesh" },
  { photo: images[0], name: "Kiran Lama", grade: "10th", rollNo: "005", parent: "Sita" },
  { photo: images[1], name: "Rohit Gurung", grade: "9th", rollNo: "006", parent: "Laxmi" },
  { photo: images[0], name: "Sita Magar", grade: "10th", rollNo: "007", parent: "Hari" },
  { photo: images[1], name: "Anil Shrestha", grade: "9th", rollNo: "008", parent: "Gita" },
  { photo: images[0], name: "Pooja Karki", grade: "10th", rollNo: "009", parent: "Bikash" },
  { photo: images[1], name: "Dipesh Tamang", grade: "9th", rollNo: "010", parent: "Suman" },
  { photo: images[0], name: "Manisha Rai", grade: "10th", rollNo: "011", parent: "Rajan" },
  { photo: images[1], name: "Bikash Sharma", grade: "9th", rollNo: "012", parent: "Anita" },
  { photo: images[0], name: "Rita Thapa", grade: "10th", rollNo: "013", parent: "Shiva" },
  { photo: images[1], name: "Suresh Lama", grade: "9th", rollNo: "014", parent: "Kiran" },
  { photo: images[0], name: "Nisha Gurung", grade: "10th", rollNo: "015", parent: "Hari" },
];
