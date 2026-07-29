import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Headphones,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DifferenceCarousel } from "@/components/landing/DifferenceCarousel";
import { ProductCardPurchase } from "@/components/store/ProductCardPurchase";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHeader } from "@/components/store/StoreHeader";
import { operationMidnightProduct } from "@/content/store/catalog";

const characters = [
  {
    name: "Orion",
    role: "Contratante da operação",
    image: "/media/characters/orion.png",
    note: "Ele conhece a primeira versão do Atlas.",
  },
  {
    name: "Vega",
    role: "Coordenadora operacional",
    image: "/media/characters/vega.png",
    note: "Ela mantém o canal aberto quando tudo muda.",
  },
  {
    name: "Adrian Voss",
    role: "Anfitrião da Mansão Vesper",
    image: "/media/characters/adrian-voss.png",
    note: "Na mansão dele, nenhum segredo fica parado.",
  },
  {
    name: "Sofia Vale",
    role: "Arquivista infiltrada",
    image: "/media/characters/sofia-vale.png",
    note: "A mensagem dela pode ser a última chance.",
  },
  {
    name: "Evelyn Cross",
    role: "Representante Meridian",
    image: "/media/characters/evelyn-cross.png",
    note: "Ela observa o leilão de um lugar privilegiado.",
  },
  {
    name: "Helena Crowe",
    role: "Chefe de segurança",
    image: "/media/characters/helena-crowe.png",
    note: "Ela ouve o prédio antes que ele acenda o alerta.",
  },
  {
    name: "Matteo Ramires",
    role: "Consultor social",
    image: "/media/characters/matteo-ramires.png",
    note: "Ele sabe circular onde ninguém deveria entrar.",
  },
];

const missions = [
  {
    ...operationMidnightProduct,
    image: "/media/product/operation-midnight-entrance.png",
    imageAlt:
      "Entrada iluminada da Mansão Vesper durante a Operação da Meia-Noite",
    status: "Disponível",
    label: "Missão 01",
    details: [
      "Thriller de espionagem",
      operationMidnightProduct.players,
      operationMidnightProduct.duration,
      operationMidnightProduct.ageRating,
      operationMidnightProduct.routes,
      operationMidnightProduct.endings,
    ],
  },
];

const steps = [
  [
    "01",
    "Abra o dossiê",
    "Espalhe os documentos sobre a mesa, conecte o aplicativo e descubra o que a equipe recebeu para investigar.",
  ],
  [
    "02",
    "Assuma sua identidade",
    "Cada jogador recebe uma responsabilidade, informações exclusivas e uma forma diferente de influenciar a missão.",
  ],
  [
    "03",
    "Cruze as pistas",
    "Ouça transmissões, analise evidências e confronte versões antes que as oportunidades desapareçam.",
  ],
  [
    "04",
    "Mude o desfecho",
    "As decisões da equipe alteram rotas, alianças e o final. Quando a noite terminar, não haverá como voltar atrás.",
  ],
];

const faqs = [
  [
    "Precisa de mestre ou narrador?",
    "Não. O anfitrião participa normalmente e o aplicativo conduz as etapas da operação.",
  ],
  [
    "Todo jogador precisa de celular?",
    "Não. Um aparelho principal é obrigatório; aparelhos individuais são opcionais.",
  ],
  [
    "O jogo possui materiais físicos?",
    "Sim. A experiência combina documentos, envelopes, mapas, marcadores e canais digitais.",
  ],
  [
    "Posso jogar mais de uma vez?",
    "As decisões e os finais podem variar, mas a política definitiva de replay ainda está em definição.",
  ],
  [
    "Como funciona a ativação do caso?",
    "O fluxo começa pela ativação da licença e depois segue para a criação da sala da equipe.",
  ],
  [
    "Outros casos serão lançados?",
    "Sim. A ViraTrama foi criada para receber novos universos e histórias independentes.",
  ],
];

export default function Home() {
  return (
    <main className="landing-page">
      <StoreHeader />

      <section
        className="landing-hero landing-hero-image-only"
        aria-labelledby="hero-title"
      >
        <h1 id="hero-title" className="visually-hidden">
          ViraTrama
        </h1>
        <Link
          href={operationMidnightProduct.href}
          className="landing-hero-poster"
          aria-label="Conhecer Operação da Meia-Noite"
        >
          <Image
            src="/media/landing/homepage-operation-midnight-campaign.png"
            alt="Banner da Operação da Meia-Noite com materiais físicos, Chave Atlas e informações da experiência"
            fill
            preload
            unoptimized
            sizes="(max-width: 760px) 100vw, 680px"
            className="hero-image"
          />
        </Link>
      </section>

      <DifferenceCarousel />

      <section id="casos" className="case-section landing-section">
        <div className="landing-container">
          <div className="catalog-heading">
            <p className="catalog-label">Missões disponíveis</p>
            <h2>Escolha sua missão.</h2>
            <p>
              Cada caixa abre um universo independente. Comece pela operação que
              inaugurou a ViraTrama.
            </p>
          </div>

          <div className="mission-list">
            {missions.map((mission) => (
              <article className="compact-product-card" key={mission.slug}>
                <h3>
                  <Link
                    href={mission.href}
                    className="compact-product-title-link"
                  >
                    {mission.title}
                  </Link>
                </h3>

                <div className="compact-product-summary">
                  <Link
                    href={mission.href}
                    className="compact-product-media"
                    aria-label={`Ver página de ${mission.title}`}
                  >
                    <Image
                      src={mission.image}
                      alt={mission.imageAlt}
                      fill
                      sizes="(max-width: 760px) 44vw, 340px"
                      className="cover-image"
                    />
                    <span className="compact-product-favorite">
                      Favorito da equipe
                    </span>
                  </Link>

                  <div className="compact-product-info">
                    <p>{mission.label}</p>
                    <strong>
                      <Link
                        href={mission.href}
                        className="compact-product-universe-link"
                      >
                        {mission.universe}
                      </Link>
                    </strong>
                    <div className="compact-product-tags">
                      <span>Comece por aqui</span>
                      <span>Cooperativo</span>
                    </div>
                    <div className="compact-product-meta">
                      {mission.details.map((detail) => (
                        <span key={detail}>{detail}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <ProductCardPurchase />
              </article>
            ))}
          </div>

          <p className="future-cases">
            <Sparkles size={15} /> Novas tramas estão em desenvolvimento.
          </p>
        </div>
      </section>

      <section id="como-funciona" className="steps-section landing-section">
        <div className="landing-container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Como a missão acontece</p>
              <h2>
                Quatro passos.
                <br />
                <em>Uma noite para decidir em quem confiar.</em>
              </h2>
            </div>
            <p>
              A caixa chega lacrada. Quando o primeiro envelope é aberto, cada
              pista, conversa e escolha passa a fazer parte da operação.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map(([number, title, text]) => (
              <article className="step-item" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hybrid-section landing-section section-wine">
        <div className="landing-container hybrid-layout">
          <div className="hybrid-copy">
            <p className="eyebrow">Físico + digital</p>
            <h2>
              A tela abre o canal.
              <br />
              <em>A história acontece na mesa.</em>
            </h2>
            <p>
              O app conduz etapas, reproduz transmissões, organiza decisões,
              registra acontecimentos e libera pistas. Ele amplia a imersão sem
              substituir a discussão e as escolhas humanas.
            </p>
            <div className="hybrid-points">
              <span>
                <Headphones size={15} /> Transmissões cinematográficas
              </span>
              <span>
                <Package size={15} /> Materiais para tocar e descobrir
              </span>
              <span>
                <ShieldCheck size={15} /> Transcrições acessíveis
              </span>
            </div>
          </div>

          <div
            className="phone-stage"
            aria-label="Prévia visual de uma transmissão no aplicativo"
          >
            <div className="phone">
              <div className="phone-speaker" />
              <div className="phone-screen">
                <Image
                  src="/media/transmissions/vega-transmission-01.png"
                  alt="Vega em uma transmissão segura da Operação da Meia-Noite"
                  fill
                  sizes="(max-width: 760px) 70vw, 260px"
                  className="phone-transmission-image"
                />
                <div className="phone-screen-overlay" />
                <div className="phone-screen-content">
                  <span className="phone-status">TRANSMISSÃO SEGURA / 01</span>
                  <p className="phone-character">VEGA</p>
                  <p className="phone-title">Três entradas</p>
                  <div className="phone-progress">
                    <span />
                  </div>
                  <div className="phone-time">
                    <span>00:42</span>
                    <span>02:18</span>
                  </div>
                  <div className="phone-button">
                    <Headphones size={14} /> Recebendo agora
                  </div>
                </div>
              </div>
            </div>
            <span className="phone-label">Canal ativo / equipe conectada</span>
          </div>
        </div>
      </section>

      <section className="characters-section landing-section">
        <div className="landing-container">
          <div className="section-heading narrow-heading">
            <p className="eyebrow">Operação da Meia-Noite</p>
            <h2>
              Todo rosto guarda
              <br />
              <em>uma versão da verdade.</em>
            </h2>
          </div>
          <div className="characters-strip">
            {characters.map((character) => (
              <details className="character-item" key={character.name}>
                <summary>
                  <div className="character-image">
                    <Image
                      src={character.image}
                      alt={`Retrato de ${character.name}`}
                      fill
                      sizes="(max-width: 640px) 42vw, 180px"
                      className="cover-image"
                    />
                  </div>
                  <span className="character-name">{character.name}</span>
                  <span className="character-role">{character.role}</span>
                  <ChevronDown className="character-chevron" size={15} />
                </summary>
                <p>{character.note}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="audience-section landing-section section-dark">
        <div className="landing-container audience-layout">
          <div>
            <p className="eyebrow">Para quem é</p>
            <h2>
              Uma mesa cheia
              <br />
              <em>de possibilidades.</em>
            </h2>
          </div>
          <div className="audience-copy">
            <p>
              Para grupos de amigos, casais que gostam de mistério, noites de
              jogo, presentes e pessoas que preferem descobrir uma história
              participando dela.
            </p>
            <div className="audience-tags">
              <span>Amigos</span>
              <span>Casais</span>
              <span>Noites de jogo</span>
              <span>Presentes</span>
              <span>Eventos pequenos</span>
              <span>Dedução + interpretação</span>
            </div>
          </div>
        </div>
      </section>

      <section id="duvidas" className="faq-section landing-section">
        <div className="landing-container faq-layout">
          <div className="section-heading">
            <p className="eyebrow">Dúvidas</p>
            <h2>
              Antes de abrir
              <br />
              <em>o primeiro envelope.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter />
    </main>
  );
}
