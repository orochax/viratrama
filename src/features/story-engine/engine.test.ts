import { describe, expect, it } from "vitest";
import { applyEffects, isAdjacent, selectEnding, tallyVotes } from "./engine";
import { initialGameState } from "./types";

describe("story engine autoritativo", () => {
  it("consome item uma unica vez", () => {
    const state = initialGameState();
    state.inventory = ["lente-azul"];
    const once = applyEffects(state, [{ type: "consume_item", key: "lente-azul" }]);
    const twice = applyEffects(once, [{ type: "consume_item", key: "lente-azul" }]);
    expect(twice.inventory).toEqual([]);
    expect(twice.consumedItems).toEqual(["lente-azul"]);
  });

  it("mantem o maior alerta", () => {
    const state = applyEffects(initialGameState(), [
      { type: "increment_alert", value: 3 },
      { type: "increment_alert", value: 4 },
    ]);
    expect(state.alertLevel).toBe(5);
    expect(state.maxAlertLevel).toBe(5);
  });

  it("valida somente movimentos adjacentes", () => {
    expect(isAdjacent("biblioteca", "corredor-restrito")).toBe(true);
    expect(isAdjacent("portao-principal", "camara-atlas")).toBe(false);
  });

  it("apura vencedor e empate sem expor voto individual", () => {
    expect(tallyVotes({ a: "orion", b: "orion", c: "voss" }).winner).toBe("orion");
    expect(tallyVotes({ a: "orion", b: "voss" }).leaders).toEqual(["orion", "voss"]);
  });

  it.each([
    ["manter", "novo-atlas"],
    ["divulgar", "transparencia-brutal"],
    ["destruir", "cinzas"],
    ["voss", "acordo-voss"],
    ["orion", "donos-segredo"],
  ] as const)("seleciona o final de sucesso %s", (vote, ending) => {
    expect(selectEnding({
      vote,
      trueKeyIdentified: true,
      selectedTrueKey: true,
      extracted: true,
      policeExpired: false,
    }).slug).toBe(ending);
  });

  it("prioriza falha pela chave errada", () => {
    expect(selectEnding({
      vote: "manter",
      trueKeyIdentified: true,
      selectedTrueKey: false,
      extracted: true,
      policeExpired: false,
    }).slug).toBe("chave-errada");
  });

  it("prioriza falha pelo prazo policial", () => {
    expect(selectEnding({
      vote: "manter",
      trueKeyIdentified: true,
      selectedTrueKey: true,
      extracted: true,
      policeExpired: true,
    }).slug).toBe("doze-minutos");
  });
});
