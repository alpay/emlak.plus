"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconLoader2,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { UploadLabelStep } from "@/components/projects/steps/upload-label-step";
import { AIEnhancementsStep } from "@/components/projects/steps/ai-enhancements-step";
import { ReviewConfirmStep } from "@/components/projects/steps/review-confirm-step";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/use-image-upload";
import {
  type NewCreationStep,
  useNewProjectCreation,
} from "@/hooks/use-new-project-creation";
import { createProjectAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface NewProjectPageProps {
  workspaceId: string;
  credits: number;
}

const STEPS_CONFIG: { id: NewCreationStep; labelKey: string; stepNumber: number }[] = [
  { id: "upload-label", labelKey: "project.steps.uploadLabel", stepNumber: 1 },
  { id: "ai-enhancements", labelKey: "project.steps.aiEnhancements", stepNumber: 2 },
  { id: "confirm", labelKey: "project.steps.confirm", stepNumber: 3 },
];

function StepIndicator({
  currentStep,
}: {
  currentStep: NewCreationStep;
}) {
  const { t } = useTranslation();
  const currentIndex = STEPS_CONFIG.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center">
        {STEPS_CONFIG.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                    isCompleted && "bg-[var(--accent-teal)] text-white",
                    isActive && "bg-[var(--accent-teal)] text-white shadow-sm shadow-[var(--accent-teal)]/30",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground border border-border"
                  )}
                >
                  {isCompleted ? (
                    <IconCheck className="h-4 w-4" />
                  ) : (
                    step.stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-bold",
                    isActive || isCompleted
                      ? "text-[var(--accent-teal)]"
                      : "text-muted-foreground"
                  )}
                >
                  {t(step.labelKey)}
                </span>
              </div>

              {index < STEPS_CONFIG.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px w-8 transition-colors",
                    index < currentIndex ? "bg-[var(--accent-teal)]" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function NewProjectPage({ workspaceId, credits }: NewProjectPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const creation = useNewProjectCreation();
  const imageUpload = useImageUpload();

  const handleCancel = React.useCallback(() => {
    creation.reset();
    imageUpload.reset();
    router.push("/dashboard");
  }, [creation, imageUpload, router]);

  const handleSubmit = React.useCallback(async () => {
    if (!creation.canProceed()) return;

    // Only require template if furniture replacement is enabled
    if (creation.aiTools.replaceFurniture && !creation.selectedTemplate) return;

    creation.setIsSubmitting(true);

    try {
      const projectFormData = new FormData();
      projectFormData.set("name", creation.projectName);
      // Only set template if furniture replacement is enabled
      if (creation.selectedTemplate) {
        projectFormData.set("styleTemplateId", creation.selectedTemplate.id);
      }
      projectFormData.set("aiTools", JSON.stringify(creation.aiTools));

      const projectResult = await createProjectAction(projectFormData);

      if (!projectResult.success) {
        console.error("Failed to create project:", projectResult.error);
        creation.setIsSubmitting(false);
        return;
      }

      const project = projectResult.data;

      // Upload images with per-image metadata
      const files = creation.images.map((img) => img.file);
      const imageMetadata = creation.images.map((img) => ({
        environment: img.environment,
        roomType: img.roomType,
      }));

      const uploadSuccess = await imageUpload.uploadImages(project.id, files, imageMetadata);

      if (!uploadSuccess) {
        console.error("Failed to upload images:", imageUpload.error);
      }

      creation.reset();
      imageUpload.reset();
      router.push(`/dashboard/${project.id}`);
    } catch (error) {
      console.error("Project creation error:", error);
      creation.setIsSubmitting(false);
    }
  }, [creation, imageUpload, router]);

  const stepTitles: Record<NewCreationStep, { title: string; description: string }> = {
    "upload-label": {
      title: t("project.uploadLabel.title"),
      description: t("project.uploadLabel.description"),
    },
    "ai-enhancements": {
      title: t("project.aiEnhancements.title"),
      description: t("project.aiEnhancements.description"),
    },
    confirm: {
      title: t("project.confirm.title"),
      description: t("project.confirm.description"),
    },
  };

  const currentStepInfo = stepTitles[creation.step];
  const creditCost = creation.images.length;

  return (
    <div className="-mt-6 flex min-h-[calc(100vh-4rem+1.5rem)] flex-col">
      {/* Step indicator header */}
      <div className="border-b bg-background">
        <StepIndicator currentStep={creation.step} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">{currentStepInfo.title}</h2>
            <p className="mt-1 text-muted-foreground">{currentStepInfo.description}</p>
          </div>

          {/* Step content */}
          {creation.step === "upload-label" && (
            <UploadLabelStep
              images={creation.images}
              onAddImages={creation.addImages}
              onRemoveImage={creation.removeImage}
              onUpdateImage={creation.updateImage}
            />
          )}
          {creation.step === "ai-enhancements" && (
            <AIEnhancementsStep
              aiTools={creation.aiTools}
              onToggleTool={creation.toggleAITool}
              selectedTemplate={creation.selectedTemplate}
              onSelectTemplate={creation.setSelectedTemplate}
              onSelectSkyOption={creation.setSelectedSkyOption}
              hasOutdoorImages={creation.images.some((img) => img.environment === "outdoor")}
            />
          )}
          {creation.step === "confirm" && (
            <ReviewConfirmStep
              images={creation.images}
              aiTools={creation.aiTools}
              selectedTemplate={creation.selectedTemplate}
              projectName={creation.projectName}
              onProjectNameChange={creation.setProjectName}
              creditCost={creditCost}
              remainingCredits={credits - creditCost}
            />
          )}
        </div>
      </main>

      {/* Fixed bottom navigation */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            {creation.step !== "upload-label" ? (
              <Button
                className="gap-2"
                disabled={creation.isSubmitting}
                onClick={creation.goToPreviousStep}
                variant="ghost"
              >
                <IconArrowLeft className="h-4 w-4" />
                {t("common.back", "Geri")}
              </Button>
            ) : (
              <Button
                className="gap-2"
                disabled={creation.isSubmitting}
                onClick={handleCancel}
                variant="ghost"
              >
                <IconArrowLeft className="h-4 w-4" />
                {t("common.back", "Geri")}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              disabled={creation.isSubmitting}
              onClick={handleCancel}
              variant="outline"
              className="text-muted-foreground hover:text-destructive"
            >
              <IconX className="mr-1 h-4 w-4" />
              {t("common.cancel", "İptal")}
            </Button>

            {creation.step === "confirm" ? (
              <Button
                className="min-w-[200px] gap-2 rounded-xl px-8 py-3 font-bold shadow-lg shadow-[var(--accent-teal)]/25 transition-all hover:-translate-y-0.5 hover:shadow-[var(--accent-teal)]/40"
                disabled={!creation.canProceed() || creation.isSubmitting || creditCost > credits}
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
                    {t("project.confirm.createProject", "Projeyi Oluştur")} ({creditCost} {t("common.credit", "kredi")})
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="gap-2 rounded-xl px-8 py-3 font-bold shadow-lg shadow-[var(--accent-teal)]/25 transition-all hover:-translate-y-0.5 hover:shadow-[var(--accent-teal)]/40"
                disabled={!creation.canProceed()}
                onClick={creation.goToNextStep}
                style={{ backgroundColor: "var(--accent-teal)" }}
              >
                {t("common.next", "İleri")}
                <IconArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
