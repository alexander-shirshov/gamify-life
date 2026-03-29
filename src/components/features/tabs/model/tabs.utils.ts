import type { TabsDirection, TabsItem } from './types';

export function getTabIndex<TKey extends string>(items: TabsItem<TKey>[], key: TKey): number {
  return items.findIndex(item => item.key === key);
}

export function getAdjacentTab<TKey extends string>(
  items: TabsItem<TKey>[],
  key: TKey,
  direction: TabsDirection
): TKey | null {
  const index = getTabIndex(items, key);

  if (index < 0) return null;

  if (direction === 'left') {
    return items[index - 1]?.key ?? null;
  }

  return items[index + 1]?.key ?? null;
}

export function getTabLabel<TKey extends string>(
  items: TabsItem<TKey>[],
  key: TKey | null
): string {
  if (!key) return '';
  return items.find(item => item.key === key)?.label ?? '';
}
