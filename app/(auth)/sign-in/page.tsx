"use client";

import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t("auth.errors.enterEmail"));
      return;
    }

    if (!password) {
      toast.error(t("auth.errors.enterPassword"));
      return;
    }

    setIsLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          toast.success(t("auth.errors.signedIn"));
          router.push(redirectTo);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || t("auth.errors.failedCreate")); // fallback message might need its own key or generic error
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("auth.welcomeBack")}</CardTitle>
        <CardDescription>
          {t("auth.enterCredentials")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.emailLabel")}</Label>
            <Input
              autoComplete="email"
              disabled={isLoading}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
            <Input
              autoComplete="current-password"
              disabled={isLoading}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              type="password"
              value={password}
            />
          </div>
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <IconLoader className="mr-2 size-4 animate-spin" />
                {t("auth.signingIn")}
              </>
            ) : (
              t("auth.signInButton")
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          {t("auth.dontHaveAccount")}{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="/sign-up"
          >
            {t("auth.signUpLink")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
