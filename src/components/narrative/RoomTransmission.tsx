"use client";

import { useSearchParams } from "next/navigation";
import type { AudioTransmission } from "@/content/operation-midnight/transmissions";
import { NarrativeTransmission } from "./NarrativeTransmission";

type Props = {
  roomCode: string;
  transmission: AudioTransmission;
  onComplete?: () => void;
};

export function RoomTransmission({ roomCode, transmission, onComplete }: Props) {
  const searchParams = useSearchParams();
  const isHost = searchParams.get("mode") !== "participant";
  return <NarrativeTransmission transmission={transmission} syncChannel={`viratrama:room:${roomCode}:transmission`} isHost={isHost} onComplete={onComplete ? () => onComplete() : undefined} />;
}
