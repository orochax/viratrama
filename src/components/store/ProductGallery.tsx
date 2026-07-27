"use client";

import Image from "next/image";
import { useState } from "react";

const galleryImages = [
  {
    src: "/media/landing/operation-midnight-banner-vertical-v2.png",
    alt: "Kit físico da Operação da Meia-Noite com a Chave Atlas",
  },
  {
    src: "/media/history/mansao-vesper.png",
    alt: "Mansão Vesper iluminada durante uma noite de chuva",
  },
  {
    src: "/media/history/planta-mansao-vesper.png",
    alt: "Planta arquitetônica da Mansão Vesper",
  },
  {
    src: "/media/history/chave-atlas-v2.png",
    alt: "Dispositivo digital Chave Atlas",
  },
  {
    src: "/media/characters/orion.png",
    alt: "Orion, o contratante da Operação da Meia-Noite",
  },
] as const;

export function ProductGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = galleryImages[selectedIndex];

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <Image
          key={selectedImage.src}
          src={selectedImage.src}
          alt={selectedImage.alt}
          fill
          preload
          unoptimized
          sizes="(max-width: 760px) calc(100vw - 36px), 900px"
        />
        <span className="product-gallery-badge product-gallery-favorite">
          Favorito da equipe
        </span>
        <span className="product-gallery-badge product-gallery-difficulty">
          Intermediário
        </span>
        <span className="product-gallery-count" aria-live="polite">
          {selectedIndex + 1} / {galleryImages.length}
        </span>
      </div>

      <div className="product-gallery-thumbnails" aria-label="Imagens do produto">
        {galleryImages.map((image, index) => (
          <button
            type="button"
            className={index === selectedIndex ? "is-selected" : undefined}
            aria-label={`Mostrar imagem ${index + 1} de ${galleryImages.length}`}
            aria-pressed={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
            key={image.src}
          >
            <Image
              src={image.src}
              alt=""
              fill
              unoptimized
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
