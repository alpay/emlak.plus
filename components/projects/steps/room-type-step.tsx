"use client";

import {
  IconArmchair,
  IconBarbell,
  IconBath,
  IconBed,
  IconBuildingBridge,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconCar,
  IconCheck,
  IconDesk,
  IconDoor,
  IconHanger,
  IconHome,
  IconMoodKid,
  IconMountain,
  IconPlant,
  IconPool,
  IconSofa,
  IconStairs,
  IconSun,
  IconTools,
  IconToolsKitchen2,
  IconTree,
  IconWashMachine,
} from "@tabler/icons-react";
import type * as React from "react";
import { useTranslation } from "react-i18next";
import { ROOM_TYPES } from "@/lib/style-templates";
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
  IconMountain,
  IconBuildingStore,
  IconHome,
  IconPool,
  IconCar,
  IconTools,
  IconBuildingBridge,
};

interface RoomTypeStepProps {
  selectedRoomType: string | null;
  onSelectRoomType: (roomType: string) => void;
}

export function RoomTypeStep({ selectedRoomType, onSelectRoomType }: RoomTypeStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground text-sm">
          {t("roomType.description", "AI'ın alanınızı daha iyi anlaması ve dönüştürmesi için oda türünü seçin.")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ROOM_TYPES.map((roomType, index) => {
          const isSelected = selectedRoomType === roomType.id;
          const IconComponent = ICON_MAP[roomType.icon];

          return (
            <button
              className={cn(
                "group relative flex animate-fade-in-up flex-col items-center gap-3 rounded-xl p-5 text-center ring-2 transition-all duration-200",
                isSelected
                  ? "bg-[var(--accent-teal)]/10 shadow-lg ring-[var(--accent-teal)]"
                  : "bg-muted/30 ring-transparent hover:bg-muted/50 hover:ring-foreground/10"
              )}
              key={roomType.id}
              onClick={() => onSelectRoomType(roomType.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              type="button"
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
                  isSelected
                    ? "bg-[var(--accent-teal)] text-white"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                )}
              >
                {IconComponent && <IconComponent className="h-6 w-6" />}
              </div>

              <div className="space-y-1">
                <h3 className={cn("font-semibold leading-tight", isSelected ? "text-foreground" : "text-foreground")}>
                  {roomType.label}
                </h3>
                <p className="text-muted-foreground text-xs">{roomType.description}</p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-teal)]">
                  <IconCheck className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
