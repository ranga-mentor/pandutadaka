import { useMemo, useState } from "react";
import {
  getRecentTotoDraws,
  getTotoDatasetSummary,
  getTotoPrediction,
  getTotoSources,
  type TotoPrediction,
} from "../tools/singaporeTotoPredictor";

const RANDOMNESS = 1;

function formatBall(ball: number): string {
  return String(ball).padStart(2, "0");
}

function formatMillions(amount?: number): string {
  if (!amount || amount <= 0) {
    return "N/A";
  }
  return `${(amount / 1_000_000).toFixed(1)} million`;
}

export default function SingaporeTotoPage() {
  const [prediction, setPrediction] = useState<TotoPrediction>(() =>
    getTotoPrediction(5, { timestamp: Date.now(), randomness: RANDOMNESS }),
  );

  const summary = useMemo(() => getTotoDatasetSummary(), []);
  const sources = useMemo(() => getTotoSources(), []);
  const recentDraws = useMemo(() => getRecentTotoDraws(8), []);

  function generateNewPrediction() {
    setPrediction(getTotoPrediction(5, { timestamp: Date.now(), randomness: RANDOMNESS }));
  }

  async function copyAll() {
    const value = prediction.sets
      .map((set) => `${set.numbers.map(formatBall).join(" ")} + ${formatBall(set.additional)}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Ignore clipboard permission errors.
    }
  }

  return (
    <section className="sg-toto-page">
      <article className="tool-card sg-toto-hero">
        <h2>
          <span className="sg-icon" aria-hidden="true">🇸🇬</span>
          <span className="lottery-icon" aria-hidden="true">🎯</span>
          Singapore Toto Predictor (History-Based)
        </h2>
        <p>
          Separate from 4D. Generates 6-number Toto sets (1-49) plus an additional number using
          historical draw trends and winning-number-frequency weighting.
        </p>
        <div className="toto-actions">
          <button onClick={generateNewPrediction} type="button">
            Generate New Toto Sets
          </button>
          <button onClick={copyAll} type="button">
            Copy All Sets
          </button>
        </div>
      </article>

      <article className="tool-card">
        <h3>Predicted Toto Sets</h3>
        <ul className="sg-toto-sets">
          {prediction.sets.map((set, index) => (
            <li key={`${set.numbers.join("-")}-${set.additional}`}>
              <strong>Set {index + 1}</strong>
              <code>{set.numbers.map(formatBall).join(" ")}</code>
              <small>Additional: {formatBall(set.additional)}</small>
              <small>Score: {(set.confidence * 100).toFixed(2)}%</small>
            </li>
          ))}
        </ul>
      </article>

      <article className="tool-card">
        <h3>Top Weighted Balls</h3>
        <ul className="sg-toto-balls">
          {prediction.ballProbabilities.slice(0, 12).map((row) => (
            <li key={row.ball}>
              <code>{formatBall(row.ball)}</code>
              <small>{(row.probability * 100).toFixed(2)}%</small>
            </li>
          ))}
        </ul>
      </article>

      <article className="tool-card">
        <h3>Recent Toto Draws</h3>
        <ul className="source-list">
          {recentDraws.map((draw) => (
            <li key={`${draw.drawDate}-${draw.drawNo}`}>
              <strong>{draw.drawDate}</strong> Draw {draw.drawNo}: {draw.winning.map(formatBall).join(" ")} + {formatBall(draw.additional)}
              {" "}• <strong>Jackpot: {formatMillions(draw.jackpotAmount)}</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="tool-card">
        <h3>Dataset Summary</h3>
        <p className="small-note">
          Draws: {summary.totalDraws} | Range: {summary.rangeStart} to {summary.rangeEnd}
        </p>
        <p className="small-note">Pool: {summary.numberPool}</p>
        <p className="small-note">{summary.sourceNote}</p>
      </article>

      <article className="tool-card">
        <h3>Data Sources</h3>
        <ul className="source-list">
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} rel="noreferrer" target="_blank">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
