import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./ui/input";
import { BiLoader } from "react-icons/bi";
import { Button } from "./ui/button";
import { toast } from "sonner";
import api from "../libs/apiCall";

export const ChangePassword = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
    getValues,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const submitPasswordHandler = async (data) => {
    try {
      setLoading(true);

      const { data: res } = await api.put(`/user/changePassword`, data);

      if (res?.status === "success") {
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20">
      <form onSubmit={handleSubmit(submitPasswordHandler)}>
        <div className="">
          <p className="text-xl font-bold text-black dark:text-white mb-1">
            Change Password
          </p>
          <span className="labelStyle">
            This will be usesd to log into your account and complete high
            severity actions.
          </span>

          <div className="mt-6 space-y-6">
            <Input
              disabled={loading}
              type="password"
              name="currentPassword"
              label="Current Password"
              register={register("currentPassword", {
                required: "Current Password is required!",
              })}
              error={
                errors.currentPassword ? errors.currentPassword.message : ""
              }
              className="inputStyles"
            />
            <Input
              disabled={loading}
              type="password"
              name="newPassword"
              label="New Password"
              register={register("newPassword", {
                required: "New Passsword is required!",
              })}
              error={errors.newPassword ? errors.newPassword.message : ""}
              className="inputStyles"
            />
            <Input
              disabled={loading}
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              register={register("confirmPassword", {
                required: "Comfirm Password is required!",
                validate: (val) => {
                  const { newPassword } = getValues();

                  return newPassword === val || "Password does not match!";
                },
              })}
              error={
                errors.confirmPassword ? errors.confirmPassword.message : ""
              }
              className="inputStyles"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 mt-10 justify-end pb-10 border-b-2 border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            loading={loading}
            type="reset"
            className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700"
          >
            Reset
          </Button>
          <Button
            loading={loading}
            type="submit"
            className="px-8 bg-violet-800 text-white"
          >
            {loading ? (
              <BiLoader className="animate-spin text-white" />
            ) : (
              "Change Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
