import { LockKeyhole } from "lucide-react";
import { GameShell } from "@/components/game/GameShell";
import { OperationDashboard } from "@/components/game/OperationDashboard";
import { OpeningTransmissionSequence } from "@/components/narrative";
import { getDashboardPreview, getOperationDashboard } from "@/content/operation-midnight/operation-dashboard";
import { getTransmission } from "@/content/operation-midnight/transmissions";

export default async function Jogo({
  params,
  searchParams,
}: {
  params: Promise<{ roomCode: string }>;
  searchParams: Promise<{ dashboard?: string }>;
}) {
  const { roomCode } = await params;
  const { dashboard } = await searchParams;
  const orion = getTransmission("MEDIA-OMN-ORION-01")!;
  const vega = getTransmission("MEDIA-OMN-VEGA-01")!;
  const operationDashboard = getOperationDashboard(roomCode, getDashboardPreview(dashboard));

  return (
    <GameShell roomCode={roomCode}>
      <OperationDashboard data={operationDashboard} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="eyebrow">Ato 1 / O convite</p>
          <h1 className="serif mt-4 text-6xl">A transmissão começa.</h1>
          <OpeningTransmissionSequence roomCode={roomCode} orion={orion} vega={vega} />
        </section>
        <aside>
          <div className="panel p-5">
            <div className="flex items-center gap-2 text-[#c7a96b]">
              <LockKeyhole size={17} />
              <span className="eyebrow">Próximo material</span>
            </div>
            <p className="mt-3">Envelope 01 · O Convite</p>
            <p className="mt-2 text-sm text-[#99a1ae]">Aguarde a instrução do aplicativo antes de abrir.</p>
          </div>
        </aside>
      </div>
    </GameShell>
  );
}
