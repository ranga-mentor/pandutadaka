export type TotoDraw = {
  date: string;
  numbers: number[];
  source: "4dinsingapore" | "singaporepools";
};

const HISTORICAL_DRAWS: TotoDraw[] = [
  // Singapore Pools official latest draw snapshot.
  { date: "2026-02-09", numbers: [10, 15, 29, 31, 33, 49], source: "singaporepools" },
  // 4dinsingapore past results pages (Mar-Apr 2024).
  { date: "2024-04-15", numbers: [5, 10, 28, 36, 41, 42], source: "4dinsingapore" },
  { date: "2024-04-11", numbers: [22, 28, 33, 40, 43, 47], source: "4dinsingapore" },
  { date: "2024-04-08", numbers: [12, 23, 24, 34, 43, 46], source: "4dinsingapore" },
  { date: "2024-04-04", numbers: [3, 4, 13, 31, 36, 43], source: "4dinsingapore" },
  { date: "2024-03-28", numbers: [6, 8, 13, 17, 26, 37], source: "4dinsingapore" },
  { date: "2024-03-18", numbers: [1, 4, 6, 15, 30, 48], source: "4dinsingapore" },
  { date: "2024-03-14", numbers: [8, 26, 34, 35, 45, 46], source: "4dinsingapore" },
];

type ScoredPair = {
  a: number;
  b: number;
  score: number;
};

function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

function frequencyAndRecencyScores(draws: TotoDraw[]): number[] {
  const scores = Array.from({ length: 50 }, () => 0);
  const recentWeightStart = draws.length;

  draws.forEach((draw, drawIndex) => {
    const recencyWeight = recentWeightStart - drawIndex;
    draw.numbers.forEach((n) => {
      scores[n] += 1;
      scores[n] += recencyWeight * 0.15;
    });
  });

  return scores;
}

function buildScoredPairs(draws: TotoDraw[]): ScoredPair[] {
  const scores = frequencyAndRecencyScores(draws);
  const pairs: ScoredPair[] = [];

  for (let a = 1; a <= 49; a += 1) {
    for (let b = a + 1; b <= 49; b += 1) {
      // Reward pairs with balanced low/high distribution.
      const spreadBonus = Math.abs(a - b) >= 10 ? 0.18 : 0;
      const oddEvenBonus = (a % 2) !== (b % 2) ? 0.12 : 0;
      const pairScore = scores[a] + scores[b] + spreadBonus + oddEvenBonus;
      pairs.push({ a, b, score: pairScore });
    }
  }

  pairs.sort((left, right) => right.score - left.score);
  return pairs;
}

export function getPredictionNumbers(count = 5): string[] {
  const pairs = buildScoredPairs(HISTORICAL_DRAWS);
  const output: string[] = [];
  const taken = new Set<string>();

  for (const pair of pairs) {
    const value = `${twoDigits(pair.a)}${twoDigits(pair.b)}`;
    if (!taken.has(value)) {
      taken.add(value);
      output.push(value);
    }
    if (output.length === count) {
      break;
    }
  }

  return output;
}

export function getTotoPredictorSources(): { label: string; url: string }[] {
  return [
    {
      label: "Singapore Pools TOTO results",
      url: "https://toto-results.singaporepools.com.sg/",
    },
    {
      label: "4dinsingapore past Toto results",
      url: "https://4dinsingapore.com/past-toto-results/",
    },
  ];
}
