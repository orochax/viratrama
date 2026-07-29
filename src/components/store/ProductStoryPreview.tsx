"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ProductStoryPreview() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="product-story-preview"
      aria-labelledby="product-story-title"
    >
      <p className="eyebrow">A história da missão</p>
      <h2 id="product-story-title">
        Uma noite para entrar. Pouco tempo para confiar.
      </h2>

      <div
        id="product-story-copy"
        className="product-story-copy"
        data-expanded={expanded}
      >
        <p>
          A Mansão Vesper abre suas portas para um baile reservado à elite. Por
          trás das máscaras, Adrian Voss prepara um leilão que não aparece em
          catálogo algum.
        </p>
        <p>
          O item principal é a Chave Atlas, um dispositivo capaz de autenticar o
          acesso a contas clandestinas, identidades protegidas e provas que
          atravessam fronteiras.
        </p>
        <p>
          Sua equipe precisa encontrar a fonte infiltrada, recuperar a chave
          verdadeira e decidir em quem confiar antes que todas as saídas sejam
          fechadas.
        </p>
      </div>

      <button
        type="button"
        className="product-story-toggle"
        aria-expanded={expanded}
        aria-controls="product-story-copy"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Ver menos" : "Ver mais"}
        <ChevronDown size={17} />
      </button>
    </section>
  );
}
