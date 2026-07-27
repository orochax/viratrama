import Image from "next/image";
import { ArrowDown, Clock3, Package, ShieldCheck, Users } from "lucide-react";
import { AddToCartBar } from "@/components/store/AddToCartBar";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHeader } from "@/components/store/StoreHeader";
import { operationMidnightProduct } from "@/content/store/catalog";
import { roles } from "@/content/operation-midnight/roles";

const archives = [
  {
    image: "/media/history/mansao-vesper.png",
    alt: "Mansão Vesper iluminada durante uma noite de chuva",
    label: "Arquivo 01",
    title: "Mansão Vesper",
    text: "Um baile aberto aos convidados. Um leilão escondido de todos eles.",
  },
  {
    image: "/media/history/planta-mansao-vesper.png",
    alt: "Planta arquitetônica da Mansão Vesper sobre uma mesa",
    label: "Arquivo 02",
    title: "Planta da Mansão",
    text: "Três rotas levam à ala restrita. Nenhuma permanece segura por muito tempo.",
  },
  {
    image: "/media/history/chave-atlas-v2.png",
    alt: "Dispositivo digital Chave Atlas sobre tecido vinho",
    label: "Arquivo 03",
    title: "Chave Atlas",
    text: "Ela não abre portas. Autentica um arquivo capaz de derrubar organizações inteiras.",
  },
];

const storyCharacters = [
  ["Orion", "Contratante", "/media/characters/orion.png", "Reuniu a equipe e sabe por que a Chave Atlas precisa desaparecer."],
  ["Vega", "Coordenadora", "/media/characters/vega.png", "Mantém a operação em movimento quando o plano começa a falhar."],
  ["Adrian Voss", "Anfitrião", "/media/characters/adrian-voss.png", "Controla a mansão, a lista de convidados e o horário do leilão."],
  ["Sofia Vale", "Arquivista", "/media/characters/sofia-vale.png", "A única fonte da equipe dentro da Mansão Vesper."],
  ["Evelyn Cross", "Representante Meridian", "/media/characters/evelyn-cross.png", "Representa uma compradora que nunca chega sem um segundo plano."],
  ["Helena Crowe", "Chefe de segurança", "/media/characters/helena-crowe.png", "Comanda a segurança e trata qualquer anomalia como ameaça."],
  ["Matteo Ramires", "Consultor social", "/media/characters/matteo-ramires.png", "Circula entre a elite e abre portas que credenciais não abrem."],
] as const;

const storyFacts = [
  [Users, operationMidnightProduct.players, "jogadores"],
  [Clock3, operationMidnightProduct.duration, "por partida"],
  [ShieldCheck, operationMidnightProduct.ageRating, "suspense"],
  [Package, operationMidnightProduct.format, "experiência"],
] as const;

const defaultRoleAvatars = {
  infiltrador: {
    image: "/media/roles/infiltrador-homem.png",
    alt: "Avatar masculino do Infiltrador",
  },
  tecnica: {
    image: "/media/roles/tecnica-mulher.png",
    alt: "Avatar feminino da Técnica",
  },
  observador: {
    image: "/media/roles/observador-homem.png",
    alt: "Avatar masculino do Observador",
  },
  negociador: {
    image: "/media/roles/negociador-mulher.png",
    alt: "Avatar feminino da Negociadora",
  },
  motorista: {
    image: "/media/roles/motorista-homem.png",
    alt: "Avatar masculino do Motorista",
  },
  analista: {
    image: "/media/roles/analista-mulher.png",
    alt: "Avatar feminino da Analista",
  },
} as const;

export default function Historia() {
  return (
    <main className="store-page story-page">
      <StoreHeader />

      <section className="story-hero" aria-labelledby="story-title">
        <Image
          src={operationMidnightProduct.image}
          alt={operationMidnightProduct.imageAlt}
          fill
          priority
          sizes="100vw"
          className="story-hero-image"
        />
        <div className="story-hero-scrim" aria-hidden="true" />
        <div className="landing-container story-hero-content">
          <p className="eyebrow">Missão 01 / Dossiê público</p>
          <h1 id="story-title">Operação da Meia-Noite:<br /><em>A Chave Atlas.</em></h1>
          <p className="story-hero-copy">
            Uma festa de máscaras. Uma mansão blindada. Um dispositivo digital capaz de
            revelar segredos que atravessam fronteiras. A operação começa quando vocês decidem entrar.
          </p>
          <div className="story-facts" aria-label="Informações da missão">
            {storyFacts.map(([Icon, value, label]) => (
              <div className="story-fact" key={label}>
                <Icon size={16} color="#c8a56a" />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <a href="#arquivos" className="button button-wine story-hero-cta">Abrir o dossiê <ArrowDown size={16} /></a>
        </div>
      </section>

      <section id="arquivos" className="story-section story-section-light">
        <div className="landing-container">
          <p className="eyebrow">Arquivos da operação</p>
          <h2 className="story-section-title">Tudo o que vocês recebem<br /><em>antes de entrar.</em></h2>
          <p className="story-section-intro">A investigação começa antes da primeira decisão. Cada material muda o jeito como a equipe enxerga a noite.</p>
          <div className="archive-grid">
            {archives.map((archive) => (
              <article className="archive-card" key={archive.label}>
                <div className="archive-image">
                  <Image src={archive.image} alt={archive.alt} fill loading="eager" unoptimized sizes="(max-width: 760px) 42vw, 33vw" />
                </div>
                <div className="archive-copy">
                  <p className="eyebrow">{archive.label}</p>
                  <h3>{archive.title}</h3>
                  <p>{archive.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section story-section-dark">
        <div className="landing-container">
          <p className="eyebrow">Escolha como entrar</p>
          <h2 className="story-section-title">Cada função enxerga<br /><em>uma parte da operação.</em></h2>
          <p className="story-section-intro">O grupo precisa de mais do que uma pessoa inteligente. Precisa de perspectivas diferentes no momento certo.</p>
          <div className="role-grid">
            {roles.map((role) => {
              const avatar = defaultRoleAvatars[role.slug];

              return (
                <article className="role-card" key={role.slug}>
                  <div className="role-avatar">
                    <Image
                      src={avatar.image}
                      alt={avatar.alt}
                      fill
                      loading="eager"
                      unoptimized
                      sizes="96px"
                    />
                  </div>
                  <div className="role-copy">
                    <h3>{role.name}</h3>
                    <p>{role.ability}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="story-section story-section-light">
        <div className="landing-container">
          <p className="eyebrow">Pessoas dentro da trama</p>
          <h2 className="story-section-title">Ninguém chega à Mansão Vesper<br /><em>sem esconder alguma coisa.</em></h2>
          <div className="story-character-grid">
            {storyCharacters.map(([name, role, image, line]) => (
              <article className="story-character-card" key={name}>
                <div className="story-character-image">
                  <Image src={image} alt={`Retrato de ${name}`} fill loading="eager" sizes="(max-width: 760px) 50vw, 25vw" />
                </div>
                <div className="story-character-copy">
                  <h3>{name}</h3>
                  <span>{role}</span>
                  <p>{line}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section story-section-dark">
        <div className="landing-container story-teaser">
          <p className="eyebrow">A história</p>
          <h2 className="story-section-title">À meia-noite,<br /><em>a verdade muda de mãos.</em></h2>
          <p>Oficialmente, a Mansão Vesper recebe uma festa beneficente. Secretamente, Adrian Voss prepara um leilão que não aparece em catálogo algum.</p>
          <p>O item principal é a Chave Atlas, um dispositivo digital capaz de autenticar o acesso a contas clandestinas, identidades protegidas e provas de crimes internacionais.</p>
          <p>Orion reuniu uma equipe para entrar na mansão antes da meia-noite. O plano parece simples: encontrar a fonte infiltrada, recuperar a Chave Atlas verdadeira e sair antes que Voss perceba o que está acontecendo.</p>
          <p>Mas dentro da Mansão Vesper, cada pessoa protege uma versão diferente da verdade. A decisão mais perigosa talvez não seja como entrar, mas em quem confiar quando chegar a hora de sair.</p>
        </div>
      </section>

      <StoreFooter />
      <AddToCartBar />
    </main>
  );
}
