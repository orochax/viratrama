import { RoomProvider } from "@/components/game/RoomProvider";

export default async function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;
  return <RoomProvider roomCode={roomCode.toUpperCase()}>{children}</RoomProvider>;
}
