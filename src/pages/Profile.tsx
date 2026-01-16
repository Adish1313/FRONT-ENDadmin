import React, { useState } from "react";
import { Lock } from "lucide-react";
import { apiCallPost } from "../api/axios";
import { API_URLS } from "../contants/constants";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await apiCallPost(API_URLS.ADMIN_CHANGE_PASSWORD, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (!res.error) {
        toast.success("Password changed successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-10">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Lock size={20} className="text-amber-500" />
          Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Current Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                New Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-900/20"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
