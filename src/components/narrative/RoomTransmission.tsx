"use client";

import { useSearchParams } from "next/navigation";
import type { AudioTransmission } from "@/content/operation-midnight/transmissions";
import { NarrativeTransmission } from "./NarrativeTransmission";

export function RoomTransmission({ roomCode, transmission }: { roomCode: string; transmission: AudioTransmission }) {
  const searchParams = useSearchParams();
  const isHost = searchParams.get("mode") !== "participant";
  return <NarrativeTransmission transmission={transmission} syncChannel={`viratrama:room:${roomCode}:transmission`} isHost={isHost} />;
}
