"use client";

import {
  Boxes,
  BriefcaseBusiness,
  GitBranch,
  Radio,
  ShieldQuestion,
  UsersRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const differences = [
  {
    title: "A história ocupa a mesa",
    text: "Documentos, envelopes, mapas e marcadores transformam cada descoberta em uma ação real.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Todos entram na trama",
    text: "O anfitrião também joga. Ninguém precisa assumir o papel de mestre ou conhecer a solução.",
    icon: UsersRound,
  },
  {
    title: "Cada decisão deixa marca",
    text: "As escolhas da equipe alteram rotas, alianças, nível de alerta e o final da história.",
    icon: GitBranch,
  },
  {
    title: "Personagens atravessam a tela",
    text: "Áudios, mensagens e transmissões fazem a narrativa reagir ao grupo durante a missão.",
    icon: Radio,
  },
  {
    title: "Segredos dentro da equipe",
    text: "Funções e objetivos individuais criam tensão sem retirar o foco da experiência cooperativa.",
    icon: ShieldQuestion,
  },
  {
    title: "Experiência física + digital",
    text: "O aplicativo conduz a operação enquanto os materiais físicos mantêm a investigação sobre a mesa.",
    icon: Boxes,
  },
];

const AUTOPLAY_INTERVAL_MS = 3000;

export function DifferenceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % differences.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (start === null || Math.abs(event.clientX - start) < 40) return;
    setActiveIndex((current) => event.clientX < start
      ? (current + 1) % differences.length
      : (current - 1 + differences.length) % differences.length);
  };

  return (
    <section
      id="diferente"
      className="difference-carousel"
      data-autoplay-ms={AUTOPLAY_INTERVAL_MS}
      aria-label="Diferenciais da ViraTrama"
      aria-roledescription="carrossel"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      <div className="difference-viewport">
        <div
          className="difference-track"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 12}px))`,
          }}
        >
          {differences.map(({ title, text, icon: Icon }, index) => (
            <article className="difference-slide" key={title} aria-hidden={index !== activeIndex}>
              <span className="difference-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.7} />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="difference-dots" aria-label="Selecionar diferencial">
        {differences.map(({ title }, index) => (
          <button
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`Mostrar diferencial: ${title}`}
            aria-current={index === activeIndex ? "true" : undefined}
            key={title}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
