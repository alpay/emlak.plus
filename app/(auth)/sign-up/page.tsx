"use client";

import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("auth.errors.enterName"));
      return;
    }

    if (!email.trim()) {
      toast.error(t("auth.errors.enterEmail"));
      return;
    }

    if (password.length < 8) {
      toast.error(t("auth.errors.passwordLength"));
      return;
    }

    setIsLoading(true);

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/onboarding",
      },
      {
        onSuccess: () => {
          toast.success(t("auth.errors.accountCreated"));
          router.push("/onboarding");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || t("auth.errors.failedCreate"));
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("auth.createAccount")}</CardTitle>
        <CardDescription>
          {t("auth.enterDetails")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.nameLabel")}</Label>
            <Input
              autoComplete="name"
              disabled={isLoading}
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder={t("auth.namePlaceholder")}
              type="text"
              value={name}
            />
          </div>
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
              autoComplete="new-password"
              disabled={isLoading}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.newPasswordPlaceholder")}
              type="password"
              value={password}
            />
          </div>
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <IconLoader className="mr-2 size-4 animate-spin" />
                {t("auth.creatingAccount")}
              </>
            ) : (
              t("auth.createAccountButton")
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="/sign-in"
          >
            {t("auth.signInLink")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
