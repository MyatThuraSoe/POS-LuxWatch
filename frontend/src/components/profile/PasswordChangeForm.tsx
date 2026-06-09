import type { PasswordChangePayload } from "../../types/user";
import { Input } from "../ui/input";
import { FormField } from "../forms/FormField";
import { Button } from "../ui/button";

type PasswordChangeFormProps = {
  onSubmit: (data: PasswordChangePayload) => void;
  isSubmitting?: boolean;
};

export function PasswordChangeForm({ onSubmit, isSubmitting = false }: PasswordChangeFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data: PasswordChangePayload = {
      current_password: formData.get("current_password") as string,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormField label="Current Password" name="current_password" type="password" required>
          <Input
            name="current_password"
            type="password"
            placeholder="Enter current password"
            disabled={isSubmitting}
            required
          />
        </FormField>

        <FormField 
          label="New Password" 
          name="new_password" 
          type="password" 
          required 
          minLength={8}
          hint="Must be at least 8 characters"
        >
          <Input
            name="new_password"
            type="password"
            placeholder="Enter new password"
            disabled={isSubmitting}
            required
            minLength={8}
          />
        </FormField>

        <FormField 
          label="Confirm New Password" 
          name="confirm_password" 
          type="password" 
          required 
          minLength={8}
        >
          <Input
            name="confirm_password"
            type="password"
            placeholder="Confirm new password"
            disabled={isSubmitting}
            required
            minLength={8}
          />
        </FormField>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}
