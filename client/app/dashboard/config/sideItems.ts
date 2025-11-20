import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Settings,
  School,
  ClipboardList,
  Bell,
  Library,
  Award,
} from 'lucide-react';

export interface SidebarItem {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  children?: { name: string }[];
}

export const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Students',
    icon: Users,
    children: [
      { name: 'All Students' }, 
      { name: 'Admissions' }, 
      { name: 'Student Records' },
      { name: 'Promotions' }
    ],
  },
  {
    name: 'Teachers',
    icon: GraduationCap,
    children: [
      { name: 'Faculty' }, 
      { name: 'Add Teacher' }, 
      { name: 'Teacher Schedule' }
    ],
  },
  {
    name: 'Academics',
    icon: BookOpen,
    children: [
      { name: 'Subjects' }, 
      { name: 'Assignments' },
      { name: 'Examinations' },
      { name: 'Grades' }
    ],
  },
  {
    name: 'Classes',
    icon: School,
    children: [
      { name: 'All Classes' }, 
      { name: 'Timetable' }, 
      { name: 'Class Teacher' }
    ],
  },
  {
    name: 'Attendance',
    icon: ClipboardList,
    children: [
      { name: 'Student Attendance' }, 
      { name: 'Staff Attendance' }, 
      { name: 'Reports' }
    ],
  },
  {
    name: 'Library',
    icon: Library,
    children: [
      { name: 'Books' }, 
      { name: 'Issue/Return' }, 
      { name: 'Members' }
    ],
  },
  {
    name: 'Calendar',
    icon: Calendar,
    children: [
      { name: 'School Events' }, 
      { name: 'Holidays' }, 
      { name: 'Exams' }
    ],
  },
  {
    name: 'Results',
    icon: Award,
    children: [
      { name: 'Report Cards' }, 
      { name: 'Merit List' }, 
      { name: 'Progress' }
    ],
  },
  {
    name: 'Notices',
    icon: Bell,
  },
  {
    name: 'Settings',
    icon: Settings,
  },
];