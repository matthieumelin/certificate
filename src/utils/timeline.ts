import type { ObjectHistory } from "../types/object";
import type { TimelineItem } from "../types/timeline";
import type { Transaction } from "../types/transaction";

export const convertHistoryToTimeline = (
  history: ObjectHistory[],
  transactions: Transaction[]
): TimelineItem[] => {
  const sortedHistory = [...history].sort(
    (a: ObjectHistory, b: ObjectHistory) => {
      const transA = transactions.find(
        (value: Transaction) => value.id === a.transactionId
      );
      const transB = transactions.find(
        (value: Transaction) => value.id === b.transactionId
      );
      if (!transA || !transB) return 0;
      return transA.date - transB.date;
    }
  );

  return sortedHistory.map((historyItem: ObjectHistory, index: number) => {
    const transaction = transactions.find(
      (value: Transaction) => value.id === historyItem.transactionId
    );

    if (!transaction) {
      return {
        label: "Évenement inconnu",
        sublabel: "",
        isLast: index === sortedHistory.length - 1,
      };
    }

    let label = "";
    const year = new Date(transaction.date).getFullYear();

    if (index === 0) {
      label = `Origin ${year}`;
    } else if (index === sortedHistory.length - 1) {
      label = "Aujourd'hui";
    } else {
      label = `${transaction.type} ${year}`;
    }

    return {
      label,
      sublabel: transaction.country,
      isLast: index === sortedHistory.length - 1,
    };
  });
};
