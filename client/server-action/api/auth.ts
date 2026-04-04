import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createApiConfig } from "../config/Api-config";
import { apiClient } from "../utils/ApiGateway";
import Swal from "sweetalert2";
// import { encryptData } from "../../utils/Secure";
import { DB, USER_ROLE } from "../../constant/constant";
import { useUpdateUser } from "./user";
import { useAuth } from "../../context/AuthProvider";

// Helper function to decode JWT token
function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (userData: any) => {
      const response = await apiClient.post("/auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },

    onSuccess: async (data: any) => {
      try {
        const user = data?.username;
        const token = data?.token;

        if (!user || !token) {
          throw new Error("Invalid register response");
        }

        // Save to localStorage
        localStorage.setItem("_UPLFMMATRIX", token);
        // localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created!",
          timer: 2000,
          showConfirmButton: false,
        });

        queryClient.setQueryData(["auth"], {
          token,
          user,
        });
      } catch (error: any) {
        console.error("Register success handler error:", error);
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: error.message,
        });
      }
    },

    onError: (error: any) => {
      console.error("Register Error:", error);
      console.log("Full Error:", error);
      console.log("Error Response:", error?.response);
      console.log("Error Data:", error?.response?.data);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error,
      });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth } = useAuth();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (userData: any) => {
      const response = await apiClient.post("/auth/login", userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },

    onSuccess: async (data: any) => {
      try {
        const token = data?.data?.token;
        const username = data?.data?.username;
        const role = data?.data?.role;
        if (!token) {
          throw new Error("No token received");
        }

        // const claims = decodeJWT(token);
        // if (!claims) {
        //   throw new Error("Invalid token");
        // }

        if(!username || !role){
          throw new Error("Invalid user data");
        }

        const user = {
          name: username,
          role: role,
        };


        if (![USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT, USER_ROLE.ACCOUNTANT].includes(role)) {
          return Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You do not have permission to login!",
          });
        }

        // ✅ Show success message
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ Store tokens and sync with AuthContext
        setAuth(user as any, token);

        queryClient.setQueryData(["auth"], {
          token,
          user,
        });
        router.push("/dashboard/student");
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Login Error",
          text: error.message || "Something went wrong",
        });
      }
    },

    onError: (error: any) => {
      console.error("Login Error:", error);

      const status = error?.response?.status;
      const backendMsg = error?.response?.data?.message;

      let msg = "Something went wrong. Please try again.";

      if (status === 401) {
        msg = backendMsg || "Incorrect email or password.";
      } else if (status === 500) {
        msg = backendMsg || "Internal server error. Please try later.";
      } else if (backendMsg) {
        msg = backendMsg;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: msg,
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async (redirectTo = "/login") => {
    try {
      localStorage.removeItem("_UPLFMMATRIX");
      localStorage.removeItem("user");

      queryClient.setQueryData(["auth"], null);
      queryClient.removeQueries({ queryKey: ["auth"] });

      await Swal.fire({
        icon: "success",
        title: "Logout Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      router.replace(redirectTo);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Logout Error",
        text: error.message || "Something went wrong",
      });
    }
  };
  return { logout };
};


export const useChangePassword = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: any) => {
      const response = await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    },
    onSuccess: async () => {
      await Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password has been updated successfully. Please log in again.",
        timer: 2000,
        showConfirmButton: false,
      });


      localStorage.removeItem("_UPLFMMATRIX");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      queryClient.setQueryData(["auth"], null);
      queryClient.removeQueries({ queryKey: ["auth"] });

      router.replace("/login");
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Failed to Change Password",
        text: error?.response?.data?.message || error?.message || "Something went wrong",
      });
    },
  });
};

// signup
const userApi = createApiConfig(DB.SIGNUP, "user", [
  "patient-history",
  "user",
  "rooms",
]);

export const useCreateUser = userApi.useCreate;
// const forgetPasswordApi = createApiConfig(DB.FORGOTPASSWORD, "forgot-password");

// export const useForgotPassword = forgetPasswordApi.useCreate;

// verify otp
// export const useVerifyOtp = async ({ otp }: { otp: string }) => {
//   const response = await apiClient.post(`/${DB.VERIFYOTP}/${otp}`);
//   return response;
// };

// // reset password
// export const useResetPassword = async ({ token, password }: { token: string; password: string }) => {
//   const response = await apiClient.post(
//     `/${DB.RESETPASSWORD}`,
//     {
//       newPassword: password,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response;
// };
