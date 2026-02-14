export type TotoDraw = {
  date: string;
  numbers: number[];
  source: "4dinsingapore" | "singaporepools";
};

export type TotoPick = {
  value: string;
  probability: number;
};

export type PositionProbability = {
  position: 1 | 2 | 3 | 4;
  digits: Array<{ digit: number; probability: number }>;
};

export type TotoPrediction = {
  picks: TotoPick[];
  positionProbabilities: PositionProbability[];
};

const HISTORICAL_DRAWS: TotoDraw[] = [
  { date: "2026-02-09", numbers: [10, 15, 29, 31, 33, 49], source: "singaporepools" },
  { date: "2024-04-15", numbers: [5, 10, 28, 36, 41, 42], source: "4dinsingapore" },
  { date: "2024-04-11", numbers: [22, 28, 33, 40, 43, 47], source: "4dinsingapore" },
  { date: "2024-04-08", numbers: [12, 23, 24, 34, 43, 46], source: "4dinsingapore" },
  { date: "2024-04-04", numbers: [3, 4, 13, 31, 36, 43], source: "4dinsingapore" },
  { date: "2024-03-28", numbers: [6, 8, 13, 17, 26, 37], source: "4dinsingapore" },
  { date: "2024-03-18", numbers: [1, 4, 6, 15, 30, 48], source: "4dinsingapore" },
  { date: "2024-03-14", numbers: [8, 26, 34, 35, 45, 46], source: "4dinsingapore" },
];

type Candidate = {
  value: string;
  probability: number;
};

function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

type DrawStats = {
  freqRecency: number[];
  lastSeenIndex: number[];
  pairFrequency: Map<string, number>;
  pairSumMean: number;
  pairSumStd: number;
};

function normalize(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }
  return (value - min) / (max - min);
}

function buildDrawStats(draws: TotoDraw[]): DrawStats {
  const freqRecency = Array.from({ length: 50 }, () => 0);
  const lastSeenIndex = Array.from({ length: 50 }, () => draws.length);
  const pairFrequency = new Map<string, number>();
  const pairSums: number[] = [];
  const latestWeight = draws.length;

  draws.forEach((draw, drawIndex) => {
    const recencyWeight = latestWeight - drawIndex;
    draw.numbers.forEach((n) => {
      freqRecency[n] += 1;
      freqRecency[n] += recencyWeight * 0.17;
      if (lastSeenIndex[n] === draws.length) {
        lastSeenIndex[n] = drawIndex;
      }
    });

    for (let i = 0; i < draw.numbers.length; i += 1) {
      for (let j = i + 1; j < draw.numbers.length; j += 1) {
        const a = Math.min(draw.numbers[i], draw.numbers[j]);
        const b = Math.max(draw.numbers[i], draw.numbers[j]);
        const key = `${a}-${b}`;
        pairFrequency.set(key, (pairFrequency.get(key) ?? 0) + 1);
        pairSums.push(a + b);
      }
    }
  });

  const pairSumMean = pairSums.reduce((sum, value) => sum + value, 0) / pairSums.length;
  const variance =
    pairSums.reduce((sum, value) => sum + (value - pairSumMean) ** 2, 0) / pairSums.length;

  return {
    freqRecency,
    lastSeenIndex,
    pairFrequency,
    pairSumMean,
    pairSumStd: Math.sqrt(variance),
  };
}

function buildCandidates(draws: TotoDraw[]): Candidate[] {
  const stats = buildDrawStats(draws);
  const baseMin = Math.min(...stats.freqRecency.slice(1));
  const baseMax = Math.max(...stats.freqRecency.slice(1));
  const maxPairFreq = Math.max(1, ...stats.pairFrequency.values());
  const rows: Array<{ value: string; score: number }> = [];

  for (let a = 1; a <= 49; a += 1) {
    for (let b = a + 1; b <= 49; b += 1) {
      const key = `${a}-${b}`;
      const nA = normalize(stats.freqRecency[a], baseMin, baseMax);
      const nB = normalize(stats.freqRecency[b], baseMin, baseMax);
      const baseScore = (nA + nB) / 2;

      const pairFrequencyScore = (stats.pairFrequency.get(key) ?? 0) / maxPairFreq;
      const overdueA = stats.lastSeenIndex[a] / draws.length;
      const overdueB = stats.lastSeenIndex[b] / draws.length;
      const overdueScore = (overdueA + overdueB) / 2;

      const sum = a + b;
      const z = stats.pairSumStd > 0 ? Math.abs(sum - stats.pairSumMean) / stats.pairSumStd : 0;
      const sumBandScore = Math.max(0, 1 - z / 3);

      const parityScore = a % 2 !== b % 2 ? 1 : 0.45;
      const spreadScore = Math.min(1, Math.abs(a - b) / 30);
      const digitDiversity = new Set(`${twoDigits(a)}${twoDigits(b)}`.split("")).size / 4;

      const score =
        baseScore * 0.38 +
        pairFrequencyScore * 0.2 +
        overdueScore * 0.17 +
        sumBandScore * 0.1 +
        parityScore * 0.07 +
        spreadScore * 0.05 +
        digitDiversity * 0.03;

      rows.push({ value: `${twoDigits(a)}${twoDigits(b)}`, score });
    }
  }

  const total = rows.reduce((sum, row) => sum + row.score, 0);
  return rows
    .sort((a, b) => b.score - a.score)
    .map((row) => ({ value: row.value, probability: row.score / total }));
}

function weightedPick(available: Candidate[]): Candidate {
  const total = available.reduce((sum, candidate) => sum + candidate.probability, 0);
  let target = Math.random() * total;
  for (const candidate of available) {
    target -= candidate.probability;
    if (target <= 0) {
      return candidate;
    }
  }
  return available[available.length - 1];
}

function buildPositionProbabilities(candidates: Candidate[]): PositionProbability[] {
  const buckets = Array.from({ length: 4 }, () => Array.from({ length: 10 }, () => 0));

  candidates.forEach((candidate) => {
    candidate.value.split("").forEach((char, index) => {
      buckets[index][Number(char)] += candidate.probability;
    });
  });

  return buckets.map((digitWeights, index) => {
    const total = digitWeights.reduce((sum, value) => sum + value, 0);
    return {
      position: (index + 1) as 1 | 2 | 3 | 4,
      digits: digitWeights.map((weight, digit) => ({
        digit,
        probability: total === 0 ? 0 : weight / total,
      })),
    };
  });
}

export function getPrediction(count = 5): TotoPrediction {
  const candidates = buildCandidates(HISTORICAL_DRAWS);
  const output: TotoPick[] = [];
  const used = new Set<string>();
  // Bias selection to higher-scored rows while still allowing variety.
  const mutable = [...candidates.slice(0, 300)];
  const size = Math.max(1, Math.min(count, 10));

  while (output.length < size && mutable.length > 0) {
    const picked = weightedPick(mutable);
    const removeIndex = mutable.findIndex((item) => item.value === picked.value);
    if (removeIndex >= 0) {
      mutable.splice(removeIndex, 1);
    }
    if (!used.has(picked.value)) {
      used.add(picked.value);
      output.push(picked);
    }
  }

  return {
    picks: output,
    positionProbabilities: buildPositionProbabilities(candidates.slice(0, 200)),
  };
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
