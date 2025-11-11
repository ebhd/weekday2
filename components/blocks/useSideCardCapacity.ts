import { useEffect, useState, RefObject } from "react";

export function useSideCardCapacity(
  tableRef: { current: HTMLDivElement | null },
  cardRef: { current: HTMLDivElement | null },
  rowsCount: number,
  gapPx = 24
) {
  const [maxSideCards, setMaxSideCards] = useState(4);

  useEffect(() => {
    if (!tableRef.current || !cardRef.current) return;

    const tableHeight = tableRef.current.offsetHeight;
    const cardHeight = cardRef.current.offsetHeight;

    const effectiveCardHeight = cardHeight + gapPx;

    if (tableHeight > 0 && effectiveCardHeight > 0) {
      const maxCardsPerColumn = Math.max(
        1,
        Math.floor((tableHeight + gapPx) / effectiveCardHeight)
      );

      setMaxSideCards(maxCardsPerColumn * 2);
    }
  }, [rowsCount, gapPx]);

  return maxSideCards;
}
