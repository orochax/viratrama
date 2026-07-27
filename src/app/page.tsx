import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Headphones,
  KeyRound,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DifferenceCarousel } from "@/components/landing/DifferenceCarousel";
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

const missions = [{
  ...operationMidnightProduct,
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
}];

const steps = [
  ["01", "Prepare a operação", "Coloque os materiais sobre a mesa, reúna a equipe e acesse o aplicativo."],
  ["02", "Assuma sua função", "Cada jogador recebe responsabilidades, informações e possíveis objetivos secretos."],
  ["03", "Investigue e decida", "Abra materiais quando autorizado, conecte pistas e escolha o caminho da equipe."],
  ["04", "Enfrente as consequências", "O aplicativo acompanha a operação e revela o desfecho construído pelo grupo."],
];

const faqs = [
  ["Quantas pessoas podem jogar?", "A experiência foi desenhada para grupos de 3 a 6 jogadores."],
  ["Quanto tempo dura uma partida?", "A previsão para uma partida é de 90 a 120 minutos."],
  ["Precisa de mestre ou narrador?", "Não. O anfitrião participa normalmente e o aplicativo conduz as etapas da operação."],
  ["Todo jogador precisa de celular?", "Não. Um aparelho principal é obrigatório; aparelhos individuais são opcionais."],
  ["O jogo possui materiais físicos?", "Sim. A experiência combina documentos, envelopes, mapas, marcadores e canais digitais."],
  ["Posso jogar mais de uma vez?", "As decisões e os finais podem variar, mas a política definitiva de replay ainda está em definição."],
  ["Como funciona a ativação do caso?", "O fluxo começa pela ativação da licença e depois segue para a criação da sala da equipe."],
  ["Outros casos serão lançados?", "Sim. A ViraTrama foi criada para receber novos universos e histórias independentes."],
];

export default function Home() {
  return (
    <main className="landing-page">
      <StoreHeader />

      <section className="landing-hero landing-hero-image-only" aria-labelledby="hero-title">
        <h1 id="hero-title" className="visually-hidden">ViraTrama</h1>
        <div className="landing-hero-poster">
          <Image
            src="/media/landing/operation-midnight-banner-vertical-v2.png"
            alt="Caixa aberta da Operação da Meia-Noite com a Chave Atlas digital, dossiê, mapa, retratos, máscara e comunicadores"
            fill
            preload
            unoptimized
            sizes="(max-width: 760px) 100vw, 680px"
            className="hero-image"
          />
        </div>
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
              <article className="mission-product" key={mission.slug}>
                <div className="mission-art">
                  <Image
                    src={mission.image}
                    alt={mission.imageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 58vw"
                    className="cover-image"
                  />
                  <span className="mission-status">{mission.status}</span>
                  <div className="case-caption">
                    <span>Arquivo Atlas</span>
                    <span>Vesper / acesso restrito</span>
                  </div>
                </div>

                <div className="mission-copy">
                  <p className="case-kicker">{mission.label}</p>
                  <p className="mission-universe">{mission.universe}</p>
                  <h3>{mission.title}</h3>
                  <p className="case-description">{mission.teaser}</p>
                  <div className="case-meta">
                    {mission.details.map((detail) => <span key={detail}>{detail}</span>)}
                  </div>
                  <div className="case-actions">
                    <Link href={mission.href} className="button button-wine">
                      Ver missão <ArrowRight size={15} />
                    </Link>
                    <Link href="/ativar" className="text-link">
                      Já tenho este caso <KeyRound size={14} />
                    </Link>
                  </div>
                </div>
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
              <p className="eyebrow">Como funciona</p>
              <h2>Quatro movimentos<br /><em>até a verdade.</em></h2>
            </div>
            <p>
              Uma partida mistura preparação, interpretação, dedução e decisões
              que não podem ser desfeitas.
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
            <h2>A tela abre o canal.<br /><em>A história acontece na mesa.</em></h2>
            <p>
              O app conduz etapas, reproduz transmissões, organiza decisões,
              registra acontecimentos e libera pistas. Ele amplia a imersão sem
              substituir a discussão e as escolhas humanas.
            </p>
            <div className="hybrid-points">
              <span><Headphones size={15} /> Transmissões cinematográficas</span>
              <span><Package size={15} /> Materiais para tocar e descobrir</span>
              <span><ShieldCheck size={15} /> Transcrições acessíveis</span>
            </div>
          </div>

          <div className="phone-stage" aria-label="Prévia visual de uma transmissão no aplicativo">
            <div className="phone">
              <div className="phone-speaker" />
              <div className="phone-screen">
                <span className="phone-status">TRANSMISSÃO SEGURA / 01</span>
                <div className="phone-signal" aria-hidden="true">
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </div>
                <p className="phone-character">VEGA</p>
                <p className="phone-title">Três entradas</p>
                <div className="phone-progress"><span /></div>
                <div className="phone-time"><span>00:42</span><span>02:18</span></div>
                <div className="phone-button"><Headphones size={14} /> Recebendo agora</div>
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
            <h2>Todo rosto guarda<br /><em>uma versão da verdade.</em></h2>
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
            <h2>Uma mesa cheia<br /><em>de possibilidades.</em></h2>
          </div>
          <div className="audience-copy">
            <p>
              Para grupos de amigos, casais que gostam de mistério, noites de jogo,
              presentes e pessoas que preferem descobrir uma história participando dela.
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
            <h2>Antes de abrir<br /><em>o primeiro envelope.</em></h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<ChevronDown size={18} /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <Image
          src="/media/landing/operation-midnight-table.png"
          alt="Materiais da Operação da Meia-Noite em uma mesa"
          fill
          sizes="100vw"
          className="hero-image"
        />
        <div className="final-scrim" />
        <div className="landing-container final-content">
          <p className="eyebrow">ViraTrama / Missão 01</p>
          <h2>A próxima decisão<br /><em>muda toda a história.</em></h2>
          <p>
            Reúna sua equipe. Abra o primeiro envelope. A operação começa quando
            todos entram na trama.
          </p>
          <div className="hero-actions">
            <Link href="/historia" className="button button-wine">
              Conhecer a missão <ArrowRight size={16} />
            </Link>
            <Link href="/ativar" className="button button-line">
              Ativar um caso <KeyRound size={16} />
            </Link>
          </div>
        </div>
      </section>

      <StoreFooter />
    </main>
  );
}
