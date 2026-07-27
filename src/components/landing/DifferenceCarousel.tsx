"use client";

import { useEffect, useRef, useState } from "react";

const differences = [
  ["A história ocupa a mesa", "Documentos, envelopes, mapas e marcadores transformam cada descoberta em uma ação real."],
  ["Todos entram na trama", "O anfitrião também joga. Ninguém precisa assumir o papel de mestre ou conhecer a solução."],
  ["Cada decisão deixa marca", "As escolhas da equipe alteram rotas, alianças, nível de alerta e o final da história."],
  ["Personagens atravessam a tela", "Áudios, mensagens e transmissões fazem a narrativa reagir ao grupo durante a missão."],
  ["Segredos dentro da equipe", "Funções e objetivos individuais criam tensão sem retirar o foco da experiência cooperativa."],
  ["Experiência física + digital", "O aplicativo conduz a operação enquanto os materiais físicos mantêm a investigação sobre a mesa."],
];

export function DifferenceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % differences.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [isPaused, reduceMotion]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
    setIsPaused(true);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    setIsPaused(false);
    if (start === null || Math.abs(event.clientX - start) < 40) return;
    setActiveIndex((current) => event.clientX < start
      ? (current + 1) % differences.length
      : (current - 1 + differences.length) % differences.length);
  };

  return (
    <section
      id="diferente"
      className="difference-carousel"
      aria-label="Diferenciais da ViraTrama"
      aria-roledescription="carrossel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
        setIsPaused(false);
      }}
    >
      <div className="difference-viewport">
        <div className="difference-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {differences.map(([title, text], index) => (
            <article className="difference-slide" key={title} aria-hidden={index !== activeIndex}>
              <p className="difference-label">Por que é diferente</p>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
