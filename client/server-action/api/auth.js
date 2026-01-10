import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiConfig } from "../config/Api-config";
import { apiClient } from "../utils/ApiGateway";
import Swal from "sweetalert2";
// import { encryptData } from "../../utils/Secure";
import { DB, userRole } from "../../constant/constant";
import { useUpdateUser } from "./user";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (userData) => {
      const response = await apiClient.post("/auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },

    onSuccess: async (data) => {
      try {
        const user = data?.data?.user;
        const tokens = data?.data?.tokens;

        if (!user || !tokens?.accessToken) {
          throw new Error("Invalid register response");
        }

        // Save to localStorage
        localStorage.setItem("_UPLFMMATRIX", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created!",
          timer: 2000,
          showConfirmButton: false,
        });

        queryClient.setQueryData(["auth"], {
          token: tokens.accessToken,
          user,
        });
      } catch (error) {
        console.error("Register success handler error:", error);
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: error.message,
        });
      }
    },

    onError: (error) => {
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
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (userData) => {
      const response = await apiClient.post("/auth/login", userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },

    onSuccess: async (data) => {
      try {
        const role = data?.data?.user?.role;

        if (![userRole.ADMIN, userRole.VENDOR, userRole.USER].includes(role)) {
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

        // ✅ Store tokens if needed
        localStorage.setItem("_UPLFMMATRIX", data?.data?.tokens?.accessToken);
        localStorage.setItem("user", JSON.stringify(data?.data?.user));

        queryClient.setQueryData(["auth"], {
          token: data?.data?.tokens?.accessToken,
          user: data?.data?.user,
        });
        navigate("/categories");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Login Error",
          text: error.message || "Something went wrong",
        });
      }
    },

    onError: (error) => {
      console.error("Login Error:", error);

      const status = error;
      const backendMsg = error;

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
  const navigate = useNavigate();

  const logout = async (redirectTo = "/login") => {
    try {
      localStorage.removeItem("_UPLFMMATRIX");
      localStorage.removeItem("user");

      queryClient.setQueryData(["auth"], null);
      queryClient.removeQueries(["auth"]);

      await Swal.fire({
        icon: "success",
        title: "Logout Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
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
      queryClient.removeQueries(["auth"]);

      navigate("/login", { replace: true });
    },
    onError: (error) => {
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
const forgetPasswordApi = createApiConfig(DB.FORGOTPASSWORD, "forgot-password");

export const useForgotPassword = forgetPasswordApi.useCreate;

// verify otp
export const useVerifyOtp = async ({ otp }) => {
  const response = await apiClient.post(`/${DB.VERIFYOTP}/${otp}`);
  return response;
};

// reset password
export const useResetPassword = async ({ token, password }) => {
  const response = await apiClient.post(
    `/${DB.RESETPASSWORD}`,
    {
      newPassword: password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
