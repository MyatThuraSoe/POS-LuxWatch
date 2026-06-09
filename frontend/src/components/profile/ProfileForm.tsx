import type { AuthUser, ProfileUpdatePayload } from "../../types/user";
import { Input } from "../ui/input";
import { FormField } from "../forms/FormField";
import { Button } from "../ui/button";

type ProfileFormProps = {
  profile?: AuthUser;
  onSubmit: (data: ProfileUpdatePayload) => void;
  isSubmitting?: boolean;
};

export function ProfileForm({ profile, onSubmit, isSubmitting = false }: ProfileFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ProfileUpdatePayload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Name" name="name" required minLength={2}>
          <Input
            name="name"
            defaultValue={profile?.name}
            placeholder="Enter your name"
            disabled={isSubmitting}
            required
            minLength={2}
          />
        </FormField>

        <FormField label="Email" name="email" type="email" required>
          <Input
            name="email"
            type="email"
            defaultValue={profile?.email}
            placeholder="Enter your email"
            disabled={isSubmitting}
            required
          />
        </FormField>

        <FormField label="Phone" name="phone" type="tel">
          <Input
            name="phone"
            type="tel"
            defaultValue={profile?.phone || ""}
            placeholder="Enter your phone number"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
