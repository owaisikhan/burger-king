// Identity as data. PLACEHOLDER values are waiting on the restaurant's real details.
export const site = {
  name: "SEARLINE",
  // Kodexa's WhatsApp (0339 0391420) for the demo, so checkout reaches a real
  // inbox. Swap in the restaurant's own number, international format, digits only.
  whatsapp: "923390391420",
  currency: "$",
};

export const money = (n: number) => `${site.currency}${n}`;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
