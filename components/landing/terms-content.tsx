"use client";

import { Trans, useTranslation } from "react-i18next";
import { LegalPage, LegalSection } from "@/components/landing/legal-page";

export function TermsContent() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <LegalPage
      lastUpdated={t("terms.lastUpdated", { date: `January 8, ${currentYear}` })}
      subtitle={t("terms.subtitle")}
      title={t("terms.title")}
    >
      <LegalSection title={t("terms.intro.title")}>
        <p>{t("terms.intro.p1")}</p>
        <p>{t("terms.intro.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.description.title")}>
        <p>{t("terms.description.p1")}</p>
      </LegalSection>

      <LegalSection title={t("terms.accounts.title")}>
        <p>{t("terms.accounts.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>{t("terms.accounts.list.accurate")}</li>
          <li>{t("terms.accounts.list.update")}</li>
          <li>{t("terms.accounts.list.security")}</li>
          <li>{t("terms.accounts.list.responsibility")}</li>
          <li>{t("terms.accounts.list.notify")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("terms.payment.title")}>
        <p>{t("terms.payment.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>
            <Trans i18nKey="terms.payment.list.photo" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="terms.payment.list.video" components={{ strong: <strong /> }} />
          </li>
        </ul>
        <p>{t("terms.payment.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.refund.title")}>
        <p>
          <Trans
            i18nKey="terms.refund.p1"
            components={{ a: <a className="underline" href="mailto:info@emlak.plus" /> }}
          />
        </p>
        <p>{t("terms.refund.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.content.title")}>
        <p>{t("terms.content.p1")}</p>
        <p>{t("terms.content.p2")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>{t("terms.content.list.process")}</li>
          <li>{t("terms.content.list.store")}</li>
          <li>{t("terms.content.list.derivative")}</li>
        </ul>
        <p>{t("terms.content.p3")}</p>
      </LegalSection>

      <LegalSection title={t("terms.ip.title")}>
        <p>{t("terms.ip.p1")}</p>
        <p>{t("terms.ip.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.prohibited.title")}>
        <p>{t("terms.prohibited.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>{t("terms.prohibited.list.rights")}</li>
          <li>{t("terms.prohibited.list.illegal")}</li>
          <li>{t("terms.prohibited.list.access")}</li>
          <li>{t("terms.prohibited.list.interfere")}</li>
          <li>{t("terms.prohibited.list.fraud")}</li>
          <li>{t("terms.prohibited.list.violate")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("terms.liability.title")}>
        <p>{t("terms.liability.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>{t("terms.liability.list.usage")}</li>
          <li>{t("terms.liability.list.unauthorized")}</li>
          <li>{t("terms.liability.list.interruption")}</li>
          <li>{t("terms.liability.list.bugs")}</li>
        </ul>
        <p>{t("terms.liability.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.warranty.title")}>
        <p>{t("terms.warranty.p1")}</p>
        <p>{t("terms.warranty.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.termination.title")}>
        <p>{t("terms.termination.p1")}</p>
        <p>{t("terms.termination.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.governing.title")}>
        <p>{t("terms.governing.p1")}</p>
      </LegalSection>

      <LegalSection title={t("terms.changes.title")}>
        <p>{t("terms.changes.p1")}</p>
        <p>{t("terms.changes.p2")}</p>
      </LegalSection>

      <LegalSection title={t("terms.contact.title")}>
        <p>{t("terms.contact.p1")}</p>
        <p className="mt-2">
          <Trans
            i18nKey="terms.contact.p2"
            components={{
              strong: <strong />,
              br: <br />,
              a: <a className="underline" />,
            }}
          />
        </p>
      </LegalSection>
    </LegalPage>
  );
}
