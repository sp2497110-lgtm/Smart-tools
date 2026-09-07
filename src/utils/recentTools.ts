import { RecentlyUsedTool, ToolDefinition } from '../types';

const STORAGE_KEY = 'smart_tools_recent';
const MAX_RECENT = 8;

export function getRecentlyUsedTools(): RecentlyUsedTool[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordToolVisit(tool: ToolDefinition): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentlyUsedTools();
    const filtered = current.filter((item) => item.id !== tool.id);
    const updated: RecentlyUsedTool[] = [
      {
        id: tool.id,
        name: tool.name,
        path: tool.path,
        category: tool.category,
        iconName: tool.iconName,
        lastUsed: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to record tool visit:', err);
  }
}

export function clearRecentlyUsedTools(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear recent tools:', err);
  }
}

export const getRecentTools = getRecentlyUsedTools;
export const addRecentTool = recordToolVisit;
export const clearRecentTools = clearRecentlyUsedTools;

