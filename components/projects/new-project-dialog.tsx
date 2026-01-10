"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconHome,
  IconLoader2,
  IconPalette,
  IconSparkles,
  IconUpload,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ConfirmStep } from "@/components/projects/steps/confirm-step";
import { RoomTypeStep } from "@/components/projects/steps/room-type-step";
import { StyleStep } from "@/components/projects/steps/style-step";
import { UploadStep } from "@/components/projects/steps/upload-step";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImageUpload } from "@/hooks/use-image-upload";
import {
  type CreationStep,
  useProjectCreation,
} from "@/hooks/use-project-creation";
import { createProjectAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StepIndicator({
  steps,
  currentStep,
}: {
  steps: { id: CreationStep; label: string; icon: React.ReactNode }[];
  currentStep: CreationStep;
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 font-medium text-sm transition-all duration-200",
                isActive && "bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]",
                isCompleted && "text-[var(--accent-teal)]",
                !(isActive || isCompleted) && "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all duration-200",
                  isActive && "bg-[var(--accent-teal)] text-white",
                  isCompleted && "bg-[var(--accent-teal)] text-white",
                  !(isActive || isCompleted) && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <IconCheck className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 transition-colors duration-200",
                  index < currentIndex ? "bg-[var(--accent-teal)]" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language?.startsWith("tr");
  const router = useRouter();
  const creation = useProjectCreation();
  const imageUpload = useImageUpload();

  const STEPS: { id: CreationStep; label: string; icon: React.ReactNode }[] = [
    { id: "upload", label: t("project.steps.upload", "Yükle"), icon: <IconUpload className="h-4 w-4" /> },
    { id: "room-type", label: t("project.steps.room", "Oda"), icon: <IconHome className="h-4 w-4" /> },
    { id: "style", label: t("project.steps.style", "Stil"), icon: <IconPalette className="h-4 w-4" /> },
    { id: "confirm", label: t("project.steps.confirm", "Onayla"), icon: <IconCheck className="h-4 w-4" /> },
  ];

  const handleClose = React.useCallback(() => {
    creation.reset();
    imageUpload.reset();
    onOpenChange(false);
  }, [creation, imageUpload, onOpenChange]);

  const handleSubmit = React.useCallback(async () => {
    if (!(creation.canProceed() && creation.selectedTemplate)) return;

    creation.setIsSubmitting(true);

    try {
      const projectFormData = new FormData();
      projectFormData.set("name", creation.projectName);
      projectFormData.set("styleTemplateId", creation.selectedTemplate.id);
      if (creation.roomType) {
        projectFormData.set("roomType", creation.roomType);
      }

      const projectResult = await createProjectAction(projectFormData);

      if (!projectResult.success) {
        console.error("Failed to create project:", projectResult.error);
        creation.setIsSubmitting(false);
        return;
      }

      const project = projectResult.data;

      const files = creation.images.map((img) => img.file);
      const uploadSuccess = await imageUpload.uploadImages(project.id, files);

      if (!uploadSuccess) {
        console.error("Failed to upload images:", imageUpload.error);
      }

      creation.reset();
      imageUpload.reset();
      onOpenChange(false);
      router.push(`/dashboard/${project.id}`);
    } catch (error) {
      console.error("Project creation error:", error);
      creation.setIsSubmitting(false);
    }
  }, [creation, imageUpload, onOpenChange, router]);

  const stepTitles: Record<CreationStep, { title: string; description: string }> = {
    upload: {
      title: t("project.upload.title", "Görselleri Yükle"),
      description: t("project.upload.description", "İyileştirmek istediğiniz gayrimenkul fotoğraflarını ekleyin"),
    },
    "room-type": {
      title: t("project.roomType.title", "Oda Türü Seçin"),
      description: t("project.roomType.description", "AI'ın bu alanın türünü anlamasına yardımcı olun"),
    },
    style: {
      title: t("project.style.title", "Stil Seçin"),
      description: t("project.style.description", "Fotoğraflarınız için bir dönüşüm stili seçin"),
    },
    confirm: {
      title: t("project.confirm.title", "İncele ve Onayla"),
      description: t("project.confirm.description", "İlanınızı adlandırın ve işleme başlamadan önce gözden geçirin"),
    },
  };

  const currentStepInfo = stepTitles[creation.step];
  const creditText = isTurkish
    ? `Oluştur (${creation.images.length} kredi)`
    : `Generate (${creation.images.length} credit${creation.images.length !== 1 ? "s" : ""})`;

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0" size="2xl">
        <div className="border-b px-6 py-4">
          <DialogHeader className="space-y-3">
            <StepIndicator currentStep={creation.step} steps={STEPS} />
            <div className="pt-2 text-center">
              <DialogTitle className="text-xl">{currentStepInfo.title}</DialogTitle>
              <DialogDescription className="mt-1">{currentStepInfo.description}</DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {creation.step === "upload" && (
            <UploadStep images={creation.images} onAddImages={creation.addImages} onRemoveImage={creation.removeImage} />
          )}
          {creation.step === "room-type" && (
            <RoomTypeStep onSelectRoomType={creation.setRoomType} selectedRoomType={creation.roomType} />
          )}
          {creation.step === "style" && (
            <StyleStep onSelectTemplate={creation.setSelectedTemplate} selectedTemplate={creation.selectedTemplate} />
          )}
          {creation.step === "confirm" && (
            <ConfirmStep
              images={creation.images}
              onProjectNameChange={creation.setProjectName}
              projectName={creation.projectName}
              selectedTemplate={creation.selectedTemplate}
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
          <div>
            {creation.step !== "upload" && (
              <Button className="gap-2" disabled={creation.isSubmitting} onClick={creation.goToPreviousStep} variant="ghost">
                <IconArrowLeft className="h-4 w-4" />
                {t("common.back")}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button disabled={creation.isSubmitting} onClick={handleClose} variant="outline">
              {t("common.cancel")}
            </Button>

            {creation.step === "confirm" ? (
              <Button
                className="min-w-[180px] gap-2"
                disabled={!creation.canProceed() || creation.isSubmitting}
                onClick={handleSubmit}
                style={{ backgroundColor: "var(--accent-teal)" }}
              >
                {creation.isSubmitting ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    {t("project.processing", "İşleniyor...")}
                  </>
                ) : (
                  <>
                    <IconSparkles className="h-4 w-4" />
                    {creditText}
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="gap-2"
                disabled={!creation.canProceed()}
                onClick={creation.goToNextStep}
                style={{ backgroundColor: "var(--accent-teal)" }}
              >
                {t("common.next")}
                <IconArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
