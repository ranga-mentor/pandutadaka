import { useMemo, useState } from "react";
import {
  getRecentTotoDraws,
  getTotoDatasetSummary,
  getTotoPrediction,
  getTotoSources,
  type TotoPrediction,
} from "../tools/singaporeTotoPredictor";

function formatBall(ball: number): string {
  return String(ball).padStart(2, "0");
}

export default function SingaporeTotoPage() {
  const [useCurrentTimestamp, setUseCurrentTimestamp] = useState(true);
  const [timestampInput, setTimestampInput] = useState(() => String(Date.now()));
  const [randomnessPercent, setRandomnessPercent] = useState(20);
  const [prediction, setPrediction] = useState<TotoPrediction>(() =>
    getTotoPrediction(5, { timestamp: Date.now(), randomness: 0.2 }),
  );

  const summary = useMemo(() => getTotoDatasetSummary(), []);
  const sources = useMemo(() => getTotoSources(), []);
  const recentDraws = useMemo(() => getRecentTotoDraws(8), []);

  function generateNewPrediction() {
    const timestamp = useCurrentTimestamp ? Date.now() : Number(timestampInput) || Date.now();
    if (useCurrentTimestamp) {
      setTimestampInput(String(timestamp));
    }

    const randomness = Math.max(0, Math.min(100, randomnessPercent)) / 100;
    setPrediction(getTotoPrediction(5, { timestamp, randomness }));
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
        <h2>Singapore Toto Predictor (History-Based)</h2>
        <p>
          Separate from 4D. Generates 6-number Toto sets (1-49) plus an additional number using
          historical draw trends and winning-number-frequency weighting.
        </p>
        <p className="small-note">Seed timestamp: {timestampInput}</p>
        <div className="toto-actions">
          <button onClick={generateNewPrediction} type="button">
            Generate New Toto Sets
          </button>
          <button onClick={copyAll} type="button">
            Copy All Sets
          </button>
        </div>
        <div className="id-options">
          <label>
            <input
              checked={useCurrentTimestamp}
              onChange={(event) => setUseCurrentTimestamp(event.target.checked)}
              type="checkbox"
            />
            Use current timestamp
          </label>
          <label>
            Timestamp
            <input
              disabled={useCurrentTimestamp}
              inputMode="numeric"
              onChange={(event) => setTimestampInput(event.target.value)}
              type="text"
              value={timestampInput}
            />
          </label>
          <label>
            Randomness {randomnessPercent}%
            <input
              max={100}
              min={0}
              onChange={(event) => setRandomnessPercent(Number(event.target.value))}
              type="range"
              value={randomnessPercent}
            />
          </label>
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
              {draw.drawDate} Draw {draw.drawNo}: {draw.winning.map(formatBall).join(" ")} + {formatBall(draw.additional)}
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
