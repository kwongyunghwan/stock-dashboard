export const NAME_STORAGE_KEY = "stock-dashboard:user-name";

export function readSavedName(): string | null {
  try {
    return localStorage.getItem(NAME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeSavedName(name: string | null) {
  try {
    if (name) localStorage.setItem(NAME_STORAGE_KEY, name);
    else localStorage.removeItem(NAME_STORAGE_KEY);
  } catch {}
}
