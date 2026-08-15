import { randomInt, randomUUID } from 'node:crypto';

export interface CaptchaChallenge {
  uuid: string;
  answer: string;
  image: string;
}
export function createMathCaptcha(): CaptchaChallenge {
  const left = randomInt(1, 10);
  const right = randomInt(1, 10);
  const text = `${left} + ${right} = ?`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="60" viewBox="0 0 160 60"><rect width="160" height="60" rx="4" fill="#f4f7fb"/><path d="M0 15L160 45M0 50L160 10" stroke="#d7e3f3" stroke-width="2"/><text x="80" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#2468a2">${text}</text></svg>`;
  return { uuid: randomUUID().replaceAll('-', ''), answer: String(left + right), image: Buffer.from(svg).toString('base64') };
}
