"use client";

import {
  IconArmchair,
  IconBarbell,
  IconBath,
  IconBed,
  IconBuildingBridge,
  IconBuildingSkyscraper,
  IconCar,
  IconDesk,
  IconDoor,
  IconDrone,
  IconHanger,
  IconHome,
  IconMoodKid,
  IconPlant,
  IconPool,
  IconRoad,
  IconSofa,
  IconStairs,
  IconSun,
  IconToolsKitchen2,
  IconTrash,
  IconTree,
  IconUpload,
  IconWashMachine,
} from "@tabler/icons-react";
import * as React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NewUploadedImage } from "@/hooks/use-new-project-creation";
import type { ImageEnvironment } from "@/lib/db/schema";
import { getRoomTypesByEnvironment } from "@/lib/style-templates";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  IconSofa,
  IconBed,
  IconToolsKitchen2,
  IconBath,
  IconArmchair,
  IconDesk,
  IconDoor,
  IconWashMachine,
  IconMoodKid,
  IconStairs,
  IconBuildingSkyscraper,
  IconBarbell,
  IconHanger,
  IconPlant,
  IconSun,
  IconTree,
  IconHome,
  IconPool,
  IconCar,
  IconBuildingBridge,
  IconRoad,
  IconDrone,
};

interface UploadLabelStepProps {
  images: NewUploadedImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onUpdateImage: (id: string, updates: Partial<Pick<NewUploadedImage, "environment" | "roomType">>) => void;
}

function EnvironmentToggle({
  value,
  onChange,
}: {
  value: ImageEnvironment;
  onChange: (value: ImageEnvironment) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg bg-muted p-1 flex items-center gap-1">
      <button
        type="button"
        className={cn(
          "flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all",
          value === "indoor"
            ? "bg-background shadow-sm text-[var(--accent-teal)]"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onChange("indoor")}
      >
        {t("roomTypes.environments.indoor", "İç Mekan")}
      </button>
      <button
        type="button"
        className={cn(
          "flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all",
          value === "outdoor"
            ? "bg-background shadow-sm text-[var(--accent-teal)]"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onChange("outdoor")}
      >
        {t("roomTypes.environments.outdoor", "Dış Mekan")}
      </button>
    </div>
  );
}

function PhotoCard({
  image,
  onRemove,
  onUpdate,
}: {
  image: NewUploadedImage;
  onRemove: () => void;
  onUpdate: (updates: Partial<Pick<NewUploadedImage, "environment" | "roomType">>) => void;
}) {
  const { t } = useTranslation();
  const roomTypes = getRoomTypesByEnvironment(image.environment);
  const currentRoomType = roomTypes.find((r) => r.id === image.roomType);
  const IconComponent = currentRoomType ? ICON_MAP[currentRoomType.icon] : null;

  // When environment changes, reset to first room type of that environment
  const handleEnvironmentChange = (env: ImageEnvironment) => {
    const newRoomTypes = getRoomTypesByEnvironment(env);
    onUpdate({
      environment: env,
      roomType: newRoomTypes[0]?.id || "living-room",
    });
  };

  return (
    <div className="rounded-2xl border bg-background p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Image preview */}
      <div className="relative mb-3">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={image.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={image.preview}
          />
        </div>
        <button
          type="button"
          className="absolute top-2 right-2 rounded-lg bg-background/90 p-2 text-destructive opacity-0 shadow-lg transition-opacity hover:bg-destructive hover:text-white group-hover:opacity-100 focus:opacity-100"
          onClick={onRemove}
        >
          <IconTrash className="h-4 w-4" />
        </button>
        <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm truncate">
          {image.name}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Environment toggle */}
        <div>
          <label className="mb-2 block pl-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("project.uploadLabel.environment", "Ortam Seçimi")}
          </label>
          <EnvironmentToggle
            value={image.environment}
            onChange={handleEnvironmentChange}
          />
        </div>

        {/* Room type select */}
        <div>
          <label className="mb-1.5 block pl-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("project.uploadLabel.roomType", "Oda Türü")}
          </label>
          <Select
            value={image.roomType}
            onValueChange={(value) => onUpdate({ roomType: value })}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((room) => {
                const RoomIcon = ICON_MAP[room.icon];
                return (
                  <SelectItem key={room.id} value={room.id}>
                    <div className="flex items-center gap-2">
                      {RoomIcon && <RoomIcon className="h-4 w-4" />}
                      {t(`roomTypes.${room.id}.label`, room.label)}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function UploadLabelStep({
  images,
  onAddImages,
  onRemoveImage,
  onUpdateImage,
}: UploadLabelStepProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        onAddImages(files);
      }
    },
    [onAddImages]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onAddImages(files);
      }
      e.target.value = "";
    },
    [onAddImages]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div
      className={cn(
        "relative",
        isDragging && "ring-2 ring-[var(--accent-teal)] ring-offset-4 rounded-2xl"
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[var(--accent-teal)]/10 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-[var(--accent-teal)]">
            <IconUpload className="h-12 w-12" />
            <p className="text-lg font-bold">Görselleri buraya bırakın</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Upload zone */}
        <div className="lg:col-span-1">
          <div
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all",
              // Match height of photo cards (aspect-[4/3] + controls ~290px)
              images.length > 0 ? "h-full" : "min-h-[380px]",
              isDragging
                ? "border-[var(--accent-teal)] bg-[var(--accent-teal)]/5"
                : "border-[var(--accent-teal)]/40 hover:border-[var(--accent-teal)]/80 hover:bg-[var(--accent-teal)]/5"
            )}
            onClick={handleClick}
          >
          <input
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleFileChange}
            ref={inputRef}
            type="file"
          />

          <div
            className={cn(
              "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300",
              isDragging ? "scale-110 rotate-3" : ""
            )}
            style={{
              backgroundColor: isDragging
                ? "var(--accent-teal)"
                : "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
            }}
          >
            <IconUpload
              className={cn("h-7 w-7", isDragging ? "text-white" : "")}
              style={{ color: isDragging ? undefined : "var(--accent-teal)" }}
            />
          </div>

          <h3 className="mb-2 text-base font-semibold">
            {isDragging
              ? t("project.uploadLabel.dropHere", "Görsellerinizi buraya bırakın")
              : t("project.uploadLabel.dragDrop", "Fotoğrafları Sürükle Bırak")}
          </h3>
          <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
            {t("project.uploadLabel.orClick", "veya göz atmak için tıklayın")}
            <br />
            {t("project.uploadLabel.maxSize", "JPEG, PNG, WebP (Maks. 10MB)")}
          </p>
          <Button
            className="shadow-lg shadow-[var(--accent-teal)]/25"
            style={{ backgroundColor: "var(--accent-teal)" }}
            type="button"
          >
            {t("project.uploadLabel.selectFile", "Dosya Seç")}
          </Button>
        </div>
      </div>

      {/* Photo cards */}
      {images.map((image) => (
        <div key={image.id} className="group">
          <PhotoCard
            image={image}
            onRemove={() => onRemoveImage(image.id)}
            onUpdate={(updates) => onUpdateImage(image.id, updates)}
          />
        </div>
      ))}
      </div>
    </div>
  );
}
