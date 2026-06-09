import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common";
import { ProfileForm, PasswordChangeForm } from "../components/profile";
import { useProfile, useUpdateProfile, useChangePassword } from "../hooks/useProfile";
import { Spinner } from "../components/ui/spinner";

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Manage your account settings and preferences"
      />

      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-brand-600 text-brand-600"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "password"
                ? "border-b-2 border-brand-600 text-brand-600"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      <div className="mx-auto max-w-2xl">
        {activeTab === "profile" && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <ProfileForm
              profile={profile}
              onSubmit={(data) => {
                updateProfileMutation.mutate(data);
              }}
              isSubmitting={updateProfileMutation.isPending}
            />
          </div>
        )}

        {activeTab === "password" && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <PasswordChangeForm
              onSubmit={(data) => {
                changePasswordMutation.mutate(data, {
                  onSuccess: () => {
                    alert("Password changed successfully");
                  },
                });
              }}
              isSubmitting={changePasswordMutation.isPending}
            />
          </div>
        )}
      </div>
    </div>
  );
}
