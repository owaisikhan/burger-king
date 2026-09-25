// Identity as data. PLACEHOLDER values are waiting on the restaurant's real details.
export const site = {
  name: "SEARLINE",
  // PLACEHOLDER: the restaurant's WhatsApp number, international format, digits only.
  whatsapp: "923000000000",
  currency: "$",
};

export const money = (n: number) => `${site.currency}${n}`;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
