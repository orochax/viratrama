import { operationMidnightProduct } from "@/content/store/catalog";
import { STORY_SLUG } from "@/content/operation-midnight/canonical";

export type CheckoutFormatId = "physical" | "digital";

export type CheckoutCatalogItem = {
  slug: string;
  storySlug: string;
  title: string;
  formatId: CheckoutFormatId;
  formatLabel: string;
  unitPriceInCents: number;
  providerProductId: string;
};

function requiredEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} não configurada`);
  return value;
}

export function getCheckoutCatalogItem(
  slug: string,
  formatId: CheckoutFormatId,
): CheckoutCatalogItem | null {
  if (slug !== operationMidnightProduct.slug) return null;
  const format = operationMidnightProduct.formatOptions.find(
    (option) => option.id === formatId,
  );
  if (!format?.available) return null;

  return {
    slug,
    storySlug: STORY_SLUG,
    title: operationMidnightProduct.title,
    formatId,
    formatLabel: format.label,
    unitPriceInCents: format.priceInCents,
    providerProductId: requiredEnvironmentValue(
      formatId === "physical"
        ? "ABACATEPAY_PHYSICAL_PRODUCT_ID"
        : "ABACATEPAY_DIGITAL_PRODUCT_ID",
    ),
  };
}
