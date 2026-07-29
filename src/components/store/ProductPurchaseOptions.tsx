"use client";

import { Check, CloudDownload, PackageCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { operationMidnightProduct } from "@/content/store/catalog";
import { useCart } from "./CartProvider";

const formatIcons = {
  physical: PackageCheck,
  digital: CloudDownload,
} as const;

export function ProductPurchaseOptions() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedFormatId, setSelectedFormatId] =
    useState<(typeof operationMidnightProduct.formatOptions)[number]["id"]>(
      "physical",
    );
  const selectedFormat =
    operationMidnightProduct.formatOptions.find(
      (format) => format.id === selectedFormatId,
    ) ?? operationMidnightProduct.formatOptions[0];

  const handleAdd = () => {
    if (!selectedFormat.available) return;

    addItem({
      slug: operationMidnightProduct.slug,
      title: operationMidnightProduct.title,
      formatId: selectedFormat.id,
      formatLabel: selectedFormat.label,
      unitPriceInCents: selectedFormat.priceInCents,
    });
    setAdded(true);
  };

  const handleSelect = (formatId: typeof selectedFormatId) => {
    setSelectedFormatId(formatId);
    setAdded(false);
  };

  return (
    <section
      className="product-format-section"
      aria-labelledby="product-format-title"
    >
      <div className="product-format-heading">
        <div>
          <p className="eyebrow">Escolha sua versão</p>
          <h2 id="product-format-title">Como a operação chega até vocês.</h2>
        </div>
        <p>
          A edição física transforma cada descoberta em algo que a equipe pode
          abrir, tocar e cruzar sobre a mesa.
        </p>
      </div>

      <div className="product-format-options" aria-label="Formatos da missão">
        {operationMidnightProduct.formatOptions.map((format) => {
          const Icon = formatIcons[format.id];
          const isSelected = selectedFormatId === format.id;

          return (
            <button
              type="button"
              className={`product-format-option${isSelected ? " is-selected" : ""}${format.available ? "" : " is-unavailable"}`}
              aria-pressed={isSelected}
              onClick={() => handleSelect(format.id)}
              key={format.id}
            >
              <div className="product-format-header">
                <div className="product-format-name">
                  <Icon size={22} />
                  <strong>{format.label}</strong>
                </div>
                {format.id === "physical" && (
                  <span className="product-format-recommended">
                    Experiência recomendada
                  </span>
                )}
              </div>
              <div className="product-format-details">
                <p>{format.description}</p>
                <span className="product-format-price">{format.price}</span>
              </div>
              {!format.available && (
                <span className="visually-hidden">Formato indisponível</span>
              )}
            </button>
          );
        })}
      </div>

      {added ? (
        <Link href="/carrinho" className="product-format-add is-added">
          <Check size={17} />
          Adicionado ao carrinho
        </Link>
      ) : (
        <button
          type="button"
          className="product-format-add"
          onClick={handleAdd}
          disabled={!selectedFormat.available}
        >
          <ShoppingCart size={17} />
          {selectedFormat.available
            ? `Adicionar versão ${selectedFormatId === "physical" ? "física" : "digital"} ao carrinho`
            : "Versão indisponível"}
        </button>
      )}
    </section>
  );
}
