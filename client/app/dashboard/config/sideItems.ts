import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  Settings,
  School,
  ClipboardList,
  Bell,
  Library,
  Award,
} from "lucide-react";

export interface SidebarItem {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path?: string; // top-level route
  children?: { name: string; path: string }[];
}

export const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Students",
    icon: Users,
    children: [
      { name: "All Students", path: "/dashboard/student" },
      { name: "Admissions", path: "/dashboard/students/admissions" },
      { name: "Student Records", path: "/dashboard/students/records" },
      { name: "Promotions", path: "/dashboard/students/promotions" },
    ],
  },
  {
    name: "Teachers",
    icon: GraduationCap,
    children: [
      { name: "Faculty", path: "/dashboard/teachers/faculty" },
      { name: "Add Teacher", path: "/dashboard/teachers/add" },
      { name: "Teacher Schedule", path: "/dashboard/teachers/schedule" },
    ],
  },
  {
    name: "Academics",
    icon: BookOpen,
    children: [
      { name: "Subjects", path: "/dashboard/academics/subjects" },
      { name: "Assignments", path: "/dashboard/academics/assignments" },
      { name: "Examinations", path: "/dashboard/academics/exams" },
      { name: "Grades", path: "/dashboard/academics/grades" },
    ],
  },
  {
    name: "Classes",
    icon: School,
    children: [
      { name: "All Classes", path: "/dashboard/classes" },
      { name: "Timetable", path: "/dashboard/classes/timetable" },
      { name: "Class Teacher", path: "/dashboard/classes/teacher" },
    ],
  },
  {
    name: "Attendance",
    icon: ClipboardList,
    children: [
      { name: "Student Attendance", path: "/dashboard/attendance/student" },
      { name: "Staff Attendance", path: "/dashboard/attendance/staff" },
      { name: "Reports", path: "/dashboard/attendance/reports" },
    ],
  },
  {
    name: "Library",
    icon: Library,
    children: [
      { name: "Books", path: "/dashboard/library/books" },
      { name: "Issue/Return", path: "/dashboard/library/issue" },
      { name: "Members", path: "/dashboard/library/members" },
    ],
  },
  {
    name: "Calendar",
    icon: Calendar,
    children: [
      { name: "School Events", path: "/dashboard/calendar/events" },
      { name: "Holidays", path: "/dashboard/calendar/holidays" },
      { name: "Exams", path: "/dashboard/calendar/exams" },
    ],
  },
  {
    name: "Results",
    icon: Award,
    children: [
      { name: "Report Cards", path: "/dashboard/results/report-cards" },
      { name: "Merit List", path: "/dashboard/results/merit-list" },
      { name: "Progress", path: "/dashboard/results/progress" },
    ],
  },
  {
    name: "Notices",
    icon: Bell,
    path: "/dashboard/notices",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];
