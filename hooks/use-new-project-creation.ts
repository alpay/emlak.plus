"use client";

import { useCallback, useState } from "react";
import type { StyleTemplate } from "@/lib/style-templates";
import type { ImageEnvironment, ProjectAITools } from "@/lib/db/schema";

export interface NewUploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  environment: ImageEnvironment;
  roomType: string;
}

export type NewCreationStep = "upload-label" | "ai-enhancements" | "confirm";

export interface NewProjectCreationState {
  step: NewCreationStep;
  images: NewUploadedImage[];
  aiTools: ProjectAITools;
  selectedTemplate: StyleTemplate | null;
  projectName: string;
  isSubmitting: boolean;
}

const DEFAULT_AI_TOOLS: ProjectAITools = {
  replaceFurniture: true,
  declutter: false,
  cleanHands: false,
  cleanCamera: false,
  turnOffScreens: false,
  lensCorrection: false,
  whiteBalance: false,
  grassGreening: false,
  blurSensitiveInfo: false,
  skyReplacement: false,
  selectedSkyOption: undefined,
};

const INITIAL_STATE: NewProjectCreationState = {
  step: "upload-label",
  images: [],
  aiTools: DEFAULT_AI_TOOLS,
  selectedTemplate: null,
  projectName: "",
  isSubmitting: false,
};

export function useNewProjectCreation() {
  const [state, setState] = useState<NewProjectCreationState>(INITIAL_STATE);

  const setStep = useCallback((step: NewCreationStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const addImages = useCallback((files: File[]) => {
    const newImages: NewUploadedImage[] = files.map((file, index) => ({
      id: `img_${Date.now()}_${index}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      environment: "indoor" as ImageEnvironment, // Default to indoor
      roomType: "living-room", // Default room type
    }));

    setState((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  }, []);

  const removeImage = useCallback((id: string) => {
    setState((prev) => {
      const imageToRemove = prev.images.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return {
        ...prev,
        images: prev.images.filter((img) => img.id !== id),
      };
    });
  }, []);

  const updateImage = useCallback(
    (id: string, updates: Partial<Pick<NewUploadedImage, "environment" | "roomType">>) => {
      setState((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.id === id ? { ...img, ...updates } : img
        ),
      }));
    },
    []
  );

  const toggleAITool = useCallback((tool: keyof ProjectAITools) => {
    setState((prev) => ({
      ...prev,
      aiTools: {
        ...prev.aiTools,
        [tool]: !prev.aiTools[tool],
      },
    }));
  }, []);

  const setSelectedSkyOption = useCallback((skyOptionId: string | undefined) => {
    setState((prev) => ({
      ...prev,
      aiTools: {
        ...prev.aiTools,
        selectedSkyOption: skyOptionId,
      },
    }));
  }, []);

  const setSelectedTemplate = useCallback((template: StyleTemplate | null) => {
    setState((prev) => ({ ...prev, selectedTemplate: template }));
  }, []);

  const setProjectName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, projectName: name }));
  }, []);

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }));
  }, []);

  const reset = useCallback(() => {
    // Clean up preview URLs
    state.images.forEach((img) => URL.revokeObjectURL(img.preview));
    setState(INITIAL_STATE);
  }, [state.images]);

  const canProceed = useCallback(() => {
    switch (state.step) {
      case "upload-label":
        return state.images.length > 0;
      case "ai-enhancements":
        // Must have a style selected if replaceFurniture is enabled
        if (state.aiTools.replaceFurniture) {
          return state.selectedTemplate !== null;
        }
        // Otherwise, any AI tool must be enabled
        return Object.values(state.aiTools).some(Boolean);
      case "confirm":
        return state.projectName.trim().length > 0;
      default:
        return false;
    }
  }, [
    state.step,
    state.images.length,
    state.aiTools,
    state.selectedTemplate,
    state.projectName,
  ]);

  const goToNextStep = useCallback(() => {
    if (!canProceed()) return;

    setState((prev) => {
      switch (prev.step) {
        case "upload-label":
          return { ...prev, step: "ai-enhancements" };
        case "ai-enhancements":
          return { ...prev, step: "confirm" };
        default:
          return prev;
      }
    });
  }, [canProceed]);

  const goToPreviousStep = useCallback(() => {
    setState((prev) => {
      switch (prev.step) {
        case "ai-enhancements":
          return { ...prev, step: "upload-label" };
        case "confirm":
          return { ...prev, step: "ai-enhancements" };
        default:
          return prev;
      }
    });
  }, []);

  return {
    ...state,
    setStep,
    addImages,
    removeImage,
    updateImage,
    toggleAITool,
    setSelectedTemplate,
    setSelectedSkyOption,
    setProjectName,
    setIsSubmitting,
    reset,
    canProceed,
    goToNextStep,
    goToPreviousStep,
  };
}

export type UseNewProjectCreationReturn = ReturnType<typeof useNewProjectCreation>;
