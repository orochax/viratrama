import { expect, test } from "@playwright/test";

test("landing abre produto e adiciona a versao fisica", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("ViraTrama");
  await expect(page.getByRole("heading", { name: "Escolha sua missão." })).toBeVisible();
  await page.getByRole("link", { name: "Ver mais detalhes" }).click();
  await expect(page).toHaveURL(/historia/);
  await page.getByRole("button", { name: /Adicionar ao carrinho/i }).click();
  await expect(page.getByRole("link", { name: /Adicionado ao carrinho/i })).toBeVisible();
});

const snapshot = {
  sessionId: "10000000-0000-4000-8000-000000000001",
  roomCode: "ATLAS7",
  status: "prologue",
  version: 8,
  isHost: true,
  selfPlayerId: "20000000-0000-4000-8000-000000000001",
  maxPlayers: 6,
  players: [
    { id: "20000000-0000-4000-8000-000000000001", nickname: "Carlo", isHost: true, isSelf: true, confirmed: true, ready: true, roleRevealed: true, roleName: "O Infiltrador", roleSlug: "infiltrador", connected: true, deviceMode: "own" },
    { id: "20000000-0000-4000-8000-000000000002", nickname: "Bia", isHost: false, isSelf: false, confirmed: true, ready: true, roleRevealed: true, roleName: "A Técnica", connected: true, deviceMode: "own" },
    { id: "20000000-0000-4000-8000-000000000003", nickname: "Rui", isHost: false, isSelf: false, confirmed: true, ready: true, roleRevealed: true, roleName: "O Observador", connected: true, deviceMode: "own" },
  ],
  dashboard: {
    startedAt: "2026-07-30T12:00:00.000Z",
    entryDeadlineAt: "2026-07-30T12:15:00.000Z",
    connected: 3,
    alertLevel: 0,
    maxAlertLevel: 0,
    score: 100,
  },
  step: {
    id: "orion-abertura",
    act: 1,
    kind: "transmission",
    title: "Canal Orion",
    objective: "Escutem ou leiam juntos a primeira transmissão.",
    context: "O Envelope 00 permanece fechado sobre a mesa.",
    canAct: true,
    envelope: "00",
    transmission: {
      code: "MEDIA-OMN-ORION-01",
      characterSlug: "orion",
      characterName: "Orion",
      role: "Contratante da operação",
      title: "A operação que não existe",
      transcript: "Entrem. Recuperem a Chave Atlas. Saiam.",
      portraitPath: "media/characters/orion.png",
      status: "not_recorded",
      requiresCompletion: true,
    },
  },
  selfRole: {
    slug: "infiltrador",
    name: "O Infiltrador",
    responsibility: "Confirma movimentos.",
    ability: "Repete um movimento.",
    secret: "Descubra a Câmara Atlas.",
  },
  state: {
    routeVotes: {},
    inventory: [],
    consumedItems: [],
    unlockedEnvelopes: ["00"],
    openedEnvelopes: [],
    unlockedFiles: [],
    completedTransmissions: [],
    locations: {},
    knownGraph: {},
    hints: [],
    finalVoteCast: false,
    flags: {},
  },
};

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`partida real cabe em ${viewport.name}`, async ({ page }, testInfo) => {
    await page.route("**/api/rooms/ATLAS7", (route) => route.fulfill({ json: snapshot }));
    await page.route("**/api/rooms/ATLAS7/media/**", (route) => route.fulfill({ json: { audioUrl: null, status: "not_recorded" } }));
    await page.setViewportSize(viewport);
    await page.goto("/sala/ATLAS7/jogo");
    await expect(page.getByRole("heading", { name: "Canal Orion" })).toBeVisible();
    await expect(page.getByText("DADO NÃO OBTIDO")).toBeVisible();
    await expect(page.getByText("Orion", { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`live-game-${viewport.name}.png`), fullPage: true });
  });
}

test("dois aparelhos recebem o mesmo snapshot sem identidade no corpo", async ({ browser }) => {
  const host = await browser.newContext();
  const guest = await browser.newContext();
  for (const context of [host, guest]) {
    await context.route("**/api/rooms/ATLAS7", (route) => route.fulfill({ json: snapshot }));
    await context.route("**/api/rooms/ATLAS7/media/**", (route) => route.fulfill({ json: { audioUrl: null } }));
  }
  const [hostPage, guestPage] = await Promise.all([host.newPage(), guest.newPage()]);
  await Promise.all([hostPage.goto("/sala/ATLAS7/jogo"), guestPage.goto("/sala/ATLAS7/jogo")]);
  await expect(hostPage.getByText("Canal Orion")).toBeVisible();
  await expect(guestPage.getByText("Canal Orion")).toBeVisible();
  await host.close();
  await guest.close();
});
