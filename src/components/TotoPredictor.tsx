import { useMemo, useState } from "react";
import {
  getMergedDatasetSummary,
  getPrediction,
  getTotoPredictorSources,
  type TotoPrediction,
} from "../tools/totoPredictor";

const RANDOMNESS = 1;

export default function TotoPredictor() {
  const [prediction, setPrediction] = useState<TotoPrediction>(() =>
    getPrediction(5, { timestamp: Date.now(), randomness: RANDOMNESS }),
  );
  const sources = useMemo(() => getTotoPredictorSources(), []);
  const summary = useMemo(() => getMergedDatasetSummary(), []);

  async function copyAll() {
    const value = prediction.picks.map((pick) => pick.value).join(", ");
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Intentionally ignore clipboard errors.
    }
  }

  function generateNewPrediction() {
    const timestamp = Date.now();
    const current = prediction.picks.map((item) => item.value).join("|");
    let next = getPrediction(5, { timestamp, randomness: RANDOMNESS });
    let attempts = 0;
    while (attempts < 5 && next.picks.map((item) => item.value).join("|") === current) {
      next = getPrediction(5, { timestamp: timestamp + attempts + 1, randomness: RANDOMNESS });
      attempts += 1;
    }
    setPrediction(next);
  }

  return (
    <section className="toto-page">
      <article className="tool-card toto-hero">
        <h2>
          <span className="sg-icon" aria-hidden="true">🇸🇬</span>
          <span className="lottery-icon" aria-hidden="true">🔢</span>
          Singapore 4D Predictor
        </h2>
        <p>5 probable 4-digit picks using merged historical data, frequency, recency, and digit-position probability.</p>
        <div className="toto-actions">
          <button onClick={generateNewPrediction} type="button">
            Generate New 4D
          </button>
          <button onClick={copyAll} type="button">
            Copy All
          </button>
        </div>
      </article>

      <article className="tool-card">
        <h3>Predicted 4D Numbers</h3>
        <ul className="toto-picks">
          {prediction.picks.map((pick) => (
            <li key={pick.value}>
              <code>{pick.value}</code>
              <small>{(pick.probability * 100).toFixed(2)}%</small>
            </li>
          ))}
        </ul>
        <p className="small-note">
          Output is always 5 unique numbers with no duplicates in the list.
        </p>
      </article>

      <article className="tool-card">
        <h3>Digit Probability by Position</h3>
        <div className="position-grid">
          {prediction.positionProbabilities.map((row) => {
            const topThree = [...row.digits]
              .sort((a, b) => b.probability - a.probability)
              .slice(0, 3);
            return (
              <div key={row.position} className="position-card">
                <h4>Position {row.position}</h4>
                <ul>
                  {topThree.map((entry) => (
                    <li key={`${row.position}-${entry.digit}`}>
                      Digit {entry.digit}: {(entry.probability * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </article>

      <article className="tool-card">
        <h3>Combined Dataset</h3>
        <p className="small-note">
          Records: {summary.totalRows} | Draws: {summary.totalDraws} | Unique numbers: {summary.uniqueNumbers}
        </p>
        <p className="small-note">
          Singapore Pools: {summary.sources.singaporepools} | 4D in Singapore: {summary.sources["4dinsingapore"]} | Live4D2U: {summary.sources.live4d2u}
        </p>
      </article>

      <article className="tool-card">
        <h3>Data Sources Used</h3>
        <ul className="source-list">
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
