import { describe, expect, it } from "vitest";
import { transmissionIdempotencyKey } from "./transmission-events";
import { transmissions } from "../../content/operation-midnight/transmissions";

describe("transmissões narrativas", () => {
  it("gera uma chave idempotente estável", () => {
    expect(transmissionIdempotencyKey("session", "MEDIA-OMN-ORION-01", "transmission_completed", "host")).toBe("session:MEDIA-OMN-ORION-01:transmission_completed:host");
  });

  it("mapeia os seis finais e a derrota", () => {
    expect(transmissions.filter((item) => item.code.startsWith("MEDIA-OMN-END-")).map((item) => item.code)).toEqual([
      "MEDIA-OMN-END-01", "MEDIA-OMN-END-02", "MEDIA-OMN-END-03", "MEDIA-OMN-END-04", "MEDIA-OMN-END-05", "MEDIA-OMN-END-06", "MEDIA-OMN-END-07",
    ]);
  });

  it("não publica placeholders como aprovados", () => {
    expect(transmissions.every((item) => item.status === "not_recorded" || item.status === "placeholder")).toBe(true);
  });
});
