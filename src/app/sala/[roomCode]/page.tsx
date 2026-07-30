import { RoomGate } from "@/components/game/RoomGate";

export default async function Sala({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = await params;
  return <RoomGate roomCode={roomCode.toUpperCase()} />;
}
