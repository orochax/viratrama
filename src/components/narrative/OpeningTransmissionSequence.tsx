"use client";

import { useState } from "react";
import type { AudioTransmission } from "@/content/operation-midnight/transmissions";
import { RoomTransmission } from "./RoomTransmission";

type Props = {
  roomCode: string;
  orion: AudioTransmission;
  vega: AudioTransmission;
};

export function OpeningTransmissionSequence({ roomCode, orion, vega }: Props) {
  const [speaker, setSpeaker] = useState<"orion" | "vega">("orion");
  const isOrion = speaker === "orion";
  const transmission = isOrion ? orion : vega;

  return (
    <>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#99a1ae]">
        {isOrion
          ? "O Envelope 00 está sobre a mesa. Orion abriu o canal seguro. Escutem juntos: a informação da operação também pode ser lida na transcrição."
          : "Orion encerrou a transmissão. Vega assume o canal para coordenar a entrada na Mansão Vesper."}
      </p>
      <div className="mt-8">
        <RoomTransmission
          roomCode={roomCode}
          transmission={transmission}
          onComplete={isOrion ? () => setSpeaker("vega") : undefined}
        />
      </div>
    </>
  );
}
