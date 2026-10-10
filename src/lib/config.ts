import raw from '../config.json' with { type: 'json' };

export const PLACEHOLDER = 'À_RENSEIGNER';

export interface Config {
  firstName: string;
  lastName: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  publishedDate: string;
  modifiedDate: string;
  license: { name: string; url: string };
  siteUrl: string;
}

const DATE_FIELDS = ['publishedDate', 'modifiedDate'];

function isValidIsoDate(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

function checkString(obj: unknown, path: string): string {
  let value: unknown = obj;
  for (const part of path.split('.')) {
    value = value !== null && typeof value === 'object' && Object.hasOwn(value, part) ? (value as Record<string, unknown>)[part] : undefined;
  }
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`config.json : champ "${path}" absent ou vide`);
  }
  if (value.includes(PLACEHOLDER)) {
    throw new Error(`config.json : champ "${path}" contient encore le placeholder ${PLACEHOLDER}`);
  }
  return value.trim();
}

/** Valide strictement une configuration brute ; l'erreur nomme le champ fautif. */
export function validateConfig(input: unknown): Config {
  const s = (path: string) => checkString(input, path);
  const config: Config = {
    firstName: s('firstName'),
    lastName: s('lastName'),
    email: s('email'),
    githubUrl: s('githubUrl'),
    linkedinUrl: s('linkedinUrl'),
    publishedDate: s('publishedDate'),
    modifiedDate: s('modifiedDate'),
    license: { name: s('license.name'), url: s('license.url') },
    siteUrl: s('siteUrl'),
  };
  for (const field of DATE_FIELDS) {
    const value = config[field as 'publishedDate' | 'modifiedDate'];
    if (!isValidIsoDate(value)) {
      throw new Error(`config.json : champ "${field}" n'est pas une date AAAA-MM-JJ valide ("${value}")`);
    }
  }
  for (const [field, url] of [['githubUrl', config.githubUrl], ['linkedinUrl', config.linkedinUrl], ['license.url', config.license.url], ['siteUrl', config.siteUrl]]) {
    if (!/^https:\/\/\S+$/.test(url)) {
      throw new Error(`config.json : champ "${field}" n'est pas une URL https ("${url}")`);
    }
  }
  if (config.modifiedDate < config.publishedDate) {
    throw new Error('config.json : champ "modifiedDate" antérieur à "publishedDate"');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
    throw new Error(`config.json : champ "email" invalide`);
  }
  return config;
}

let cached: Config | undefined;
/** Configuration du site, validée au premier appel (le build échoue si elle est invalide). */
export function getConfig(): Config {
  return (cached ??= validateConfig(raw));
}
