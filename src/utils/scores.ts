interface Score {
  range: number[];
  name: string;
  color: string;
}

export const liquidityScores: Score[] = [
  {
    name: "Illiquide",
    color: "#fff",
    range: [0, 35],
  },
  {
    name: "Très peu liquide",
    color: "#fff",
    range: [36, 50],
  },
  {
    name: "Peu liquide",
    color: "#fff",
    range: [51, 65],
  },
  {
    name: "Liquide",
    color: "#fff",
    range: [66, 80],
  },
  {
    name: "Très liquide",
    color: "#fff",
    range: [81, 100],
  },
];

export const generalConditions: Score[] = [
  {
    name: "Très mauvaise condition",
    color: "#fff",
    range: [0, 35],
  },
  {
    name: "Mauvaise condition",
    color: "#fff",
    range: [36, 49],
  },
  {
    name: "Condition satisfaisante",
    color: "#fff",
    range: [50, 65],
  },
  {
    name: "Bonne condition",
    color: "#fff",
    range: [66, 85],
  },
  {
    name: "Excellente condition",
    color: "#fff",
    range: [86, 99],
  },
  {
    name: "Neuf",
    color: "#fff",
    range: [100, 100],
  },
];
