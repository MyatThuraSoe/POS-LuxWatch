import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "../forms";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { useLoginMutation } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-[2.35rem] h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
          <FormField
            autoComplete="email"
            error={errors.email?.message}
            label="Email"
            placeholder="admin@luxwatch.local"
            type="email"
            {...register("email")}
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800 dark:text-slate-200"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              autoComplete="current-password"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="pl-9 pr-10"
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:focus-ring dark:hover:bg-slate-800 dark:hover:text-slate-200"
              onClick={() => setShowPassword((value) => !value)}
              type="button"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs font-medium text-danger" id="password-error">
              {errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            className="h-4 w-4 rounded border-slate-300 text-brand-700 focus-visible:focus-ring"
            type="checkbox"
            {...register("remember")}
          />
          Remember me
        </label>
        <a
          className="text-sm font-medium text-brand-700 hover:text-brand-600 dark:text-brand-300"
          href="/forgot-password"
        >
          Forgot password?
        </a>
      </div>

      {loginMutation.error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : "Unable to sign in. Check your credentials and try again."}
        </div>
      ) : null}

      <Button className="w-full" disabled={loginMutation.isPending} size="lg" type="submit">
        {loginMutation.isPending ? <Spinner /> : null}
        Sign in
      </Button>
    </form>
  );
}
