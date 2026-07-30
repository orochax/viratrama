import { describe, expect, it } from "vitest";
import { runCommand, type RuntimeSession } from "./runtime";
import { initialGameState } from "./types";

function session(players = 3): RuntimeSession {
  return {
    status: "lobby",
    state: initialGameState(),
    players: Array.from({ length: players }, (_, index) => ({
      id: `00000000-0000-4000-8000-00000000000${index}`,
      nickname: `Jogador ${index + 1}`,
      isHost: index === 0,
      confirmed: true,
      ready: false,
      roleRevealed: false,
      isActive: true,
      deviceMode: "own",
    })),
    startedAt: null,
    pausedAt: null,
    alarmDeadlineAt: null,
    entryDeadlineAt: null,
    extractionDeadlineAt: null,
  };
}

describe("runtime da partida", () => {
  it.each([3, 4, 5, 6])("distribui funcoes validas para %i jogadores", (count) => {
    const source = session(count);
    const result = runCommand(source, source.players[0].id, { type: "assign_roles", mode: "automatic" });
    const roles = result.session.players.map((player) => player.roleSlug);
    expect(new Set(roles).size).toBe(count);
    expect(result.session.status).toBe("role_reveal");
  });

  it("nao inicia sem todos prontos", () => {
    const source = session();
    source.status = "role_reveal";
    expect(() => runCommand(source, source.players[0].id, { type: "start_game" })).toThrow(/Todos precisam/);
  });

  it("cria deadlines no servidor ao iniciar", () => {
    const source = session();
    source.status = "role_reveal";
    source.players.forEach((player) => {
      player.roleRevealed = true;
      player.ready = true;
    });
    const now = new Date("2026-07-30T00:00:00.000Z");
    const result = runCommand(source, source.players[0].id, { type: "start_game" }, now);
    expect(result.session.startedAt).toBe(now.toISOString());
    expect(result.session.entryDeadlineAt).toBe("2026-07-30T00:15:00.000Z");
  });

  it("mantem Orion antes de Vega e nao pula no refresh", () => {
    const source = session();
    source.status = "prologue";
    source.state.currentStep = "orion-abertura";
    const result = runCommand(source, source.players[0].id, { type: "complete_step" });
    expect(result.session.state.currentStep).toBe("vega-briefing");
    expect(result.session.state.completedTransmissions).toEqual(["MEDIA-OMN-ORION-01"]);
  });
});
