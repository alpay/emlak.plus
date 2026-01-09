"use client";

import {
  IconAlertCircle,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
} from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// Pre-compiled regex patterns for performance
const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^a-zA-Z0-9]/;

function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) {
    return { score: 0, label: "", color: "" };
  }

  let score = 0;
  if (password.length >= 8) {
    score++;
  }
  if (password.length >= 12) {
    score++;
  }
  if (LOWERCASE_REGEX.test(password) && UPPERCASE_REGEX.test(password)) {
    score++;
  }
  if (DIGIT_REGEX.test(password)) {
    score++;
  }
  if (SPECIAL_CHAR_REGEX.test(password)) {
    score++;
  }

  if (score <= 1) {
    return { score, label: "Weak", color: "bg-red-500" };
  }
  if (score <= 2) {
    return { score, label: "Fair", color: "bg-orange-500" };
  }
  if (score <= 3) {
    return { score, label: "Good", color: "bg-yellow-500" };
  }
  if (score <= 4) {
    return { score, label: "Strong", color: "bg-green-500" };
  }
  return { score, label: "Excellent", color: "bg-emerald-500" };
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(newPassword),
    [newPassword]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = "New password must be different from current";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (result.error) {
        if (result.error.message?.toLowerCase().includes("incorrect")) {
          setErrors({ currentPassword: "Current password is incorrect" });
        } else {
          setErrors({
            general: result.error.message || "Failed to change password",
          });
        }
        return;
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const hasLowerAndUpper =
    LOWERCASE_REGEX.test(newPassword) && UPPERCASE_REGEX.test(newPassword);
  const hasDigit = DIGIT_REGEX.test(newPassword);
  const hasSpecialChar = SPECIAL_CHAR_REGEX.test(newPassword);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* General Error */}
      {errors.general && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-500 text-sm">
          <IconAlertCircle className="h-4 w-4 shrink-0" />
          {errors.general}
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-2">
        <Label className="font-medium text-sm" htmlFor="current-password">
          Current Password
        </Label>
        <div className="relative">
          <IconLock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="current-password"
            className={cn(
              "pr-10 pl-10",
              errors.currentPassword && "border-red-500"
            )}
            disabled={isLoading}
            id="current-password"
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (errors.currentPassword) {
                setErrors({ ...errors, currentPassword: undefined });
              }
            }}
            placeholder="Enter your current password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
          />
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            tabIndex={-1}
            type="button"
          >
            {showCurrentPassword ? (
              <IconEyeOff className="h-4 w-4" />
            ) : (
              <IconEye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-red-500 text-sm">{errors.currentPassword}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label className="font-medium text-sm" htmlFor="new-password">
          New Password
        </Label>
        <div className="relative">
          <IconLock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="new-password"
            className={cn(
              "pr-10 pl-10",
              errors.newPassword && "border-red-500"
            )}
            disabled={isLoading}
            id="new-password"
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) {
                setErrors({ ...errors, newPassword: undefined });
              }
            }}
            placeholder="Enter your new password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
          />
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowNewPassword(!showNewPassword)}
            tabIndex={-1}
            type="button"
          >
            {showNewPassword ? (
              <IconEyeOff className="h-4 w-4" />
            ) : (
              <IconEye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword}</p>
        )}

        {/* Password strength indicator */}
        {newPassword && (
          <div className="space-y-1.5">
            <div className="flex h-1.5 gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  className={cn(
                    "h-full flex-1 rounded-full transition-colors",
                    passwordStrength.score >= level
                      ? passwordStrength.color
                      : "bg-muted"
                  )}
                  key={level}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              Password strength:{" "}
              <span
                className={cn(
                  "font-medium",
                  passwordStrength.score <= 1 && "text-red-500",
                  passwordStrength.score === 2 && "text-orange-500",
                  passwordStrength.score === 3 && "text-yellow-500",
                  passwordStrength.score >= 4 && "text-green-500"
                )}
              >
                {passwordStrength.label}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label className="font-medium text-sm" htmlFor="confirm-password">
          Confirm New Password
        </Label>
        <div className="relative">
          <IconLock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="new-password"
            className={cn(
              "pr-10 pl-10",
              errors.confirmPassword && "border-red-500"
            )}
            disabled={isLoading}
            id="confirm-password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: undefined });
              }
            }}
            placeholder="Confirm your new password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
          />
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
            type="button"
          >
            {showConfirmPassword ? (
              <IconEyeOff className="h-4 w-4" />
            ) : (
              <IconEye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
        {confirmPassword &&
          newPassword === confirmPassword &&
          !errors.confirmPassword && (
            <p className="flex items-center gap-1 text-green-500 text-sm">
              <IconCheck className="h-4 w-4" />
              Passwords match
            </p>
          )}
      </div>

      {/* Password requirements */}
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Password requirements:
        </p>
        <ul className="space-y-1 text-muted-foreground text-xs">
          <li
            className={cn(
              "flex items-center gap-1.5",
              newPassword.length >= 8 && "text-green-500"
            )}
          >
            {newPassword.length >= 8 ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              <span className="h-3 w-3 rounded-full border border-current" />
            )}
            At least 8 characters
          </li>
          <li
            className={cn(
              "flex items-center gap-1.5",
              hasLowerAndUpper && "text-green-500"
            )}
          >
            {hasLowerAndUpper ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              <span className="h-3 w-3 rounded-full border border-current" />
            )}
            Mix of uppercase and lowercase letters
          </li>
          <li
            className={cn(
              "flex items-center gap-1.5",
              hasDigit && "text-green-500"
            )}
          >
            {hasDigit ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              <span className="h-3 w-3 rounded-full border border-current" />
            )}
            At least one number
          </li>
          <li
            className={cn(
              "flex items-center gap-1.5",
              hasSpecialChar && "text-green-500"
            )}
          >
            {hasSpecialChar ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              <span className="h-3 w-3 rounded-full border border-current" />
            )}
            At least one special character
          </li>
        </ul>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end border-t pt-4">
        <Button
          className="gap-2 shadow-sm"
          disabled={isLoading}
          style={{ backgroundColor: "var(--accent-teal)" }}
          type="submit"
        >
          {isLoading ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Changing Password…
            </>
          ) : (
            <>
              <IconLock className="h-4 w-4" />
              Change Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
