"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormType } from "@/lib/validation/login.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useLogin } from "@/server-action/api/auth";

export default function LoginForm() {
  const {mutate,isPending} = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormType) => {
    console.log("Submitting login:", values);
    mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-t-4 border-t-green-700 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-green-100 bg-white shadow-sm">
            <Image
              src="/salyansthan-logo.png"
              alt="School Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Academic Portal</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Username Field */}
            <div>
              <label className="text-sm font-medium">Username</label>
              <Input
                {...register("username")}
                placeholder="Enter your username"
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                {...register("password")}
                type="password"
                placeholder="******"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-700 hover:bg-green-600 text-white mt-2"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
