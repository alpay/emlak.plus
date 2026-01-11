"use client";

import { Trans, useTranslation } from "react-i18next";
import { LegalPage, LegalSection } from "@/components/landing/legal-page";

export function PrivacyContent() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <LegalPage
      lastUpdated={t("privacy.lastUpdated", { date: `January 8, ${currentYear}` })}
      subtitle={t("privacy.subtitle")}
      title={t("privacy.title")}
    >
      <LegalSection title={t("privacy.intro.title")}>
        <p>{t("privacy.intro.p1")}</p>
        <p>{t("privacy.intro.p2")}</p>
      </LegalSection>

      <LegalSection title={t("privacy.collection.title")}>
        <p>{t("privacy.collection.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>
            <Trans i18nKey="privacy.collection.list.account" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.collection.list.payment" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.collection.list.images" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.collection.list.usage" components={{ strong: <strong /> }} />
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={t("privacy.usage.title")}>
        <p>{t("privacy.usage.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>{t("privacy.usage.list.provide")}</li>
          <li>{t("privacy.usage.list.process")}</li>
          <li>{t("privacy.usage.list.communicate")}</li>
          <li>{t("privacy.usage.list.respond")}</li>
          <li>{t("privacy.usage.list.analyze")}</li>
          <li>{t("privacy.usage.list.prevent")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("privacy.storage.title")}>
        <p>{t("privacy.storage.p1")}</p>
        <p>{t("privacy.storage.p2")}</p>
      </LegalSection>

      <LegalSection title={t("privacy.sharing.title")}>
        <p>{t("privacy.sharing.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>
            <Trans i18nKey="privacy.sharing.list.providers" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.sharing.list.legal" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.sharing.list.business" components={{ strong: <strong /> }} />
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={t("privacy.rights.title")}>
        <p>{t("privacy.rights.p1")}</p>
        <ul className="ml-4 list-disc space-y-2">
          <li>
            <Trans i18nKey="privacy.rights.list.access" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.rights.list.rectification" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.rights.list.erasure" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.rights.list.portability" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.rights.list.objection" components={{ strong: <strong /> }} />
          </li>
          <li>
            <Trans i18nKey="privacy.rights.list.restriction" components={{ strong: <strong /> }} />
          </li>
        </ul>
        <p>
          <Trans
            i18nKey="privacy.rights.p2"
            components={{ a: <a className="underline" href="mailto:info@emlak.plus" /> }}
          />
        </p>
      </LegalSection>

      <LegalSection title={t("privacy.cookies.title")}>
        <p>{t("privacy.cookies.p1")}</p>
      </LegalSection>

      <LegalSection title={t("privacy.retention.title")}>
        <p>{t("privacy.retention.p1")}</p>
      </LegalSection>

      <LegalSection title={t("privacy.changes.title")}>
        <p>{t("privacy.changes.p1")}</p>
      </LegalSection>

      <LegalSection title={t("privacy.contact.title")}>
        <p>{t("privacy.contact.p1")}</p>
        <p className="mt-2">
          <Trans
            i18nKey="privacy.contact.p2"
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
