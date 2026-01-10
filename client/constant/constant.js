// ================= ROLE & STATUS =================

export const ROLE_ENUM = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  ACCOUNTANT: "accountant",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

export const STATUS_ENUM = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

// ================= DATABASE / API MODULES =================

export const DB = {
  // Auth & User
  USER: "user",
  TOKEN: "token",
  SIGNUP: "signup",
  LOGIN: "login",
  LOGOUT: "logout",
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  CHANGE_PASSWORD: "change-password",
  VERIFY_OTP: "verify-otp",

  // School Core
  STUDENT: "Student",
  TEACHER: "Teacher",
  STAFF: "staff",
  CLASS: "Class",
  SECTION: "Section",
  SUBJECT: "subject",

  // Academic
  ROUTINE: "routine",
  ATTENDANCE: "attendance",
  EXAM: "exam",
  RESULT: "result",

  // Fees & Finance
  FEES: "fees",
  FEES_TYPE: "fees-type",
  PAYMENT: "payment",
  INVOICE: "invoice",

  // Permissions
  PERMISSION: "permission",
  ROLE: "role",
};

// ================= USER ROLES (UI / AUTH USE) =================

export const USER_ROLE = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  ACCOUNTANT: "accountant",
};

// ================= TOKEN / JOB STATUS =================

export const TokenStatus = {
  QUEUE: "IN_QUEUE",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

// ================= PERMISSIONS =================

export const PERMISSION = {
  // Student
  VIEW_STUDENT: "view_student",
  CREATE_STUDENT: "create_student",
  UPDATE_STUDENT: "update_student",
  DELETE_STUDENT: "delete_student",

  // Teacher
  VIEW_TEACHER: "view_teacher",
  CREATE_TEACHER: "create_teacher",
  UPDATE_TEACHER: "update_teacher",
  DELETE_TEACHER: "delete_teacher",

  // Fees
  VIEW_FEES: "view_fees",
  COLLECT_FEES: "collect_fees",
  UPDATE_FEES: "update_fees",

  // Routine
  VIEW_ROUTINE: "view_routine",
  UPDATE_ROUTINE: "update_routine",
};
