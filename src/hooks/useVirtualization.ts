import { useMemo } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualization = (
  items: any[],
  { itemHeight, containerHeight, overscan = 5 }: VirtualizationOptions
) => {
  const virtualItems = useMemo(() => {
    const scrollTop = 0; // This would come from a scroll container in a real implementation
    const visibleStartIndex = Math.floor(scrollTop / itemHeight);
    const visibleEndIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
    
    const startIndex = Math.max(0, visibleStartIndex - overscan);
    const endIndex = Math.min(items.length - 1, visibleEndIndex + overscan);
    
    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        index: i,
        item: items[i],
        offset: i * itemHeight,
      });
    }
    
    return visibleItems;
  }, [items, itemHeight, containerHeight, overscan]);

  const totalHeight = items.length * itemHeight;

  return {
    virtualItems,
    totalHeight,
  };
};