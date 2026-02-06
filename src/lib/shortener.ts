const STORAGE_KEY = "snip-links";

export interface SnipLink {
  id: string;
  shortCode: string;
  createdAt: number;
  clicks: number;
  // Content
  message: string;
  whatsappNumber?: string;
  // Optional: plain URL redirect (keep backward compat)
  originalUrl?: string;
}

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getLinks(): SnipLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLinks(links: SnipLink[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function sanitizeWhatsAppNumber(num: string): string {
  // Strip everything except digits and leading +
  return num.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
}

export function createSnipLink(data: {
  message: string;
  whatsappNumber?: string;
}): SnipLink {
  const links = getLinks();

  const link: SnipLink = {
    id: crypto.randomUUID(),
    shortCode: generateShortCode(),
    createdAt: Date.now(),
    clicks: 0,
    message: data.message.trim(),
    whatsappNumber: data.whatsappNumber
      ? sanitizeWhatsAppNumber(data.whatsappNumber)
      : undefined,
  };

  saveLinks([link, ...links]);
  return link;
}

export function findByShortCode(code: string): SnipLink | undefined {
  const links = getLinks();
  return links.find((l) => l.shortCode === code);
}

export function incrementClicks(code: string): void {
  const links = getLinks();
  const link = links.find((l) => l.shortCode === code);
  if (link) {
    link.clicks += 1;
    saveLinks(links);
  }
}

export function deleteLink(id: string): void {
  const links = getLinks().filter((l) => l.id !== id);
  saveLinks(links);
}

export function buildWhatsAppUrl(number: string, prefilledText?: string): string {
  const base = `https://wa.me/${number.replace(/^\+/, "")}`;
  if (prefilledText) {
    return `${base}?text=${encodeURIComponent(prefilledText)}`;
  }
  return base;
}
