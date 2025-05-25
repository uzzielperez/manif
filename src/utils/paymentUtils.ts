export function isMeditationUnlocked(id: string | undefined): boolean {
  if (!id) return false;
  const unlocked = JSON.parse(localStorage.getItem('unlockedMeditations') || '[]');
  return unlocked.includes(id);
}

export function unlockMeditation(id: string | undefined): void {
  if (!id) return;
  const unlocked = JSON.parse(localStorage.getItem('unlockedMeditations') || '[]');
  if (!unlocked.includes(id)) {
    unlocked.push(id);
    localStorage.setItem('unlockedMeditations', JSON.stringify(unlocked));
  }
}

export function getDownloadCredits(): number {
  return parseInt(localStorage.getItem('downloadCredits') || '0', 10);
}

export function addDownloadCredits(amount: number): void {
  const current = getDownloadCredits();
  localStorage.setItem('downloadCredits', (current + amount).toString());
}

export function useDownloadCredit(): boolean {
  const current = getDownloadCredits();
  if (current > 0) {
    localStorage.setItem('downloadCredits', (current - 1).toString());
    return true;
  }
  return false;
}

export function getPriceByDuration(duration: number | undefined): number {
  if (duration === undefined) return 4.99; // Default price if duration not known
  if (duration <= 5) return 2.99;
  if (duration <= 10) return 4.99;
  return 4.99; // Max price for longer durations
} 