import { useMemo, useState } from "react";
import {
  generateNric,
  normalizeNric,
  validateNric,
  type NricPrefixSelection,
} from "../tools/nric";
import {
  generateHongKongId,
  generateMalaysiaId,
  type HkCheckDigitFormat,
  type HkPrefixMode,
  validateHongKongId,
  validateMalaysiaId,
} from "../tools/asiaIds";

const PREFIX_OPTIONS: NricPrefixSelection[] = ["AUTO", "S", "T", "F", "G", "M"];

export default function NricTools() {
  const [countryPage, setCountryPage] = useState<"sg" | "my" | "hk">("sg");

  const [valueToValidate, setValueToValidate] = useState("");
  const [prefixSelection, setPrefixSelection] =
    useState<NricPrefixSelection>("AUTO");
  const [generatedSg, setGeneratedSg] = useState<string>(() =>
    generateNric("AUTO"),
  );
  const [valueToValidateMy, setValueToValidateMy] = useState("");
  const [generatedMy, setGeneratedMy] = useState<string>(() =>
    generateMalaysiaId("any"),
  );
  const [valueToValidateHk, setValueToValidateHk] = useState("");
  const [hkPrefixMode, setHkPrefixMode] = useState<HkPrefixMode>("auto");
  const [hkCheckDigitFormat, setHkCheckDigitFormat] =
    useState<HkCheckDigitFormat>("hyphen");
  const [generatedHk, setGeneratedHk] = useState<string>(() =>
    generateHongKongId({ prefixMode: "auto", checkDigitFormat: "hyphen" }),
  );
  const [copyStateSg, setCopyStateSg] = useState<"idle" | "copied">("idle");
  const [copyStateMy, setCopyStateMy] = useState<"idle" | "copied">("idle");
  const [copyStateHk, setCopyStateHk] = useState<"idle" | "copied">("idle");
  const [logicPopup, setLogicPopup] = useState<null | "sg" | "my" | "hk">(null);

  const validationResult = useMemo(
    () => validateNric(valueToValidate),
    [valueToValidate],
  );
  const validationResultMy = useMemo(
    () => validateMalaysiaId(valueToValidateMy),
    [valueToValidateMy],
  );
  const validationResultHk = useMemo(
    () => validateHongKongId(valueToValidateHk),
    [valueToValidateHk],
  );

  async function copyGeneratedValue(
    value: string,
    setState: (next: "idle" | "copied") => void,
  ) {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      setTimeout(() => setState("idle"), 1200);
    } catch {
      setState("idle");
    }
  }

  const logicTextByCountry: Record<"sg" | "my" | "hk", string[]> = {
    sg: [
      "Format: prefix + 7 digits + suffix (e.g. S1234567D).",
      "Supported prefixes: S, T, F, G, M.",
      "Checksum uses weights 2,7,6,5,4,3,2 on 7 digits.",
      "Offset: T/G = +4, M = +3, S/F = +0.",
      "Suffix map: S/T -> JZIHGFEDCBA, F/G -> XWUTRQPNMLK, M -> XWUTRQPNJLK.",
      "Generator creates random 7-digit serial, computes suffix from prefix rules.",
    ],
    my: [
      "Format: YYMMDD-PB-#### (also accepts compact 12 digits).",
      "YYMMDD is randomly generated date in configured range.",
      "PB is a state/place code from known MyKad code list.",
      "Last 4 digits are random serial.",
      "Gender hint (common convention): odd last digit often male, even often female.",
      "Validator checks structure, date validity, and state/place code validity.",
    ],
    hk: [
      "Format: 1-2 prefix letters + 6 digits + check digit.",
      "Output style supports hyphen (default) or parentheses.",
      "Examples: A123456-7, AB123456(9).",
      "Checksum uses HKID weighted sum with implied leading space for 1-letter prefix.",
      "Letter mapping: A=10 ... Z=35.",
      "Check digit is computed modulo 11 (10 represented as A).",
    ],
  };

  const logicTitleByCountry: Record<"sg" | "my" | "hk", string> = {
    sg: "Singapore ID Generation Logic",
    my: "Malaysia ID Generation Logic",
    hk: "Hong Kong ID Generation Logic",
  };

  return (
    <>
      <section className="country-switcher">
        <button
          className={countryPage === "sg" ? "is-active" : ""}
          onClick={() => setCountryPage("sg")}
          type="button"
        >
          Singapore
        </button>
        <button
          className={countryPage === "my" ? "is-active" : ""}
          onClick={() => setCountryPage("my")}
          type="button"
        >
          Malaysia
        </button>
        <button
          className={countryPage === "hk" ? "is-active" : ""}
          onClick={() => setCountryPage("hk")}
          type="button"
        >
          Hong Kong
        </button>
      </section>

      {countryPage === "sg" && (
        <section className="nric-tools">
          <article className="tool-card">
            <h2>Singapore NRIC/FIN Validator</h2>
            <p>Checks format and checksum for S, T, F, G, and M series.</p>
            <label htmlFor="nric-input">NRIC/FIN value</label>
            <input
              id="nric-input"
              className="tool-input"
              value={valueToValidate}
              onChange={(event) => setValueToValidate(event.target.value)}
              placeholder="e.g. S1234567D"
            />
            {valueToValidate.trim() ? (
              <div
                className={validationResult.valid ? "result ok" : "result bad"}
                role="status"
              >
                <strong>{validationResult.valid ? "Valid" : "Invalid"}</strong>
                <p>Normalized: {normalizeNric(valueToValidate)}</p>
                {!validationResult.valid && validationResult.reason && (
                  <p>{validationResult.reason}</p>
                )}
              </div>
            ) : (
              <div className="result neutral">Enter a value to validate.</div>
            )}
          </article>

          <article className="tool-card">
            <h2>Singapore NRIC/FIN Generator</h2>
            <p>Generates one random value with correct checksum (test/demo use only).</p>
            <button
              className="logic-button"
              onClick={() => setLogicPopup("sg")}
              type="button"
            >
              View generation logic
            </button>
            <div className="generator-controls">
              <label htmlFor="prefix-select">Prefix</label>
              <select
                id="prefix-select"
                className="tool-select"
                value={prefixSelection}
                onChange={(event) =>
                  setPrefixSelection(event.target.value as NricPrefixSelection)
                }
              >
                {PREFIX_OPTIONS.map((prefix) => (
                  <option key={prefix} value={prefix}>
                    {prefix}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setGeneratedSg(generateNric(prefixSelection));
                  setCopyStateSg("idle");
                }}
              >
                Generate
              </button>
            </div>
            <div className="generated-single">
              <button
                className="generated-value"
                onClick={() => copyGeneratedValue(generatedSg, setCopyStateSg)}
                title="Click to copy"
                type="button"
              >
                <code>{generatedSg}</code>
              </button>
              <p>{copyStateSg === "copied" ? "Copied to clipboard" : "Click ID to copy"}</p>
            </div>
          </article>
        </section>
      )}

      {countryPage === "my" && (
        <section className="nric-tools">
          <article className="tool-card">
            <h2>Malaysia MyKad Validator</h2>
            <p>Checks format and basic date/state structure.</p>
            <label htmlFor="mykad-input">MyKad value</label>
            <input
              id="mykad-input"
              className="tool-input"
              value={valueToValidateMy}
              onChange={(event) => setValueToValidateMy(event.target.value)}
              placeholder="e.g. 900101-14-5678"
            />
            {valueToValidateMy.trim() ? (
              <div
                className={validationResultMy.valid ? "result ok" : "result bad"}
                role="status"
              >
                <strong>{validationResultMy.valid ? "Valid" : "Invalid"}</strong>
                <p>Normalized: {validationResultMy.normalized}</p>
                {!validationResultMy.valid && validationResultMy.reason && (
                  <p>{validationResultMy.reason}</p>
                )}
              </div>
            ) : (
              <div className="result neutral">Enter a value to validate.</div>
            )}
          </article>

          <article className="tool-card">
            <h2>Malaysia MyKad Generator</h2>
            <p>Generates one sample MyKad style ID (YYMMDD-PB-####).</p>
            <button
              className="logic-button"
              onClick={() => setLogicPopup("my")}
              type="button"
            >
              View generation logic
            </button>
            <div className="generator-controls">
              <span />
              <button
                type="button"
                onClick={() => {
                  setGeneratedMy(generateMalaysiaId("any"));
                  setCopyStateMy("idle");
                }}
              >
                Generate
              </button>
            </div>
            <div className="generated-single">
              <button
                className="generated-value"
                onClick={() => copyGeneratedValue(generatedMy, setCopyStateMy)}
                title="Click to copy"
                type="button"
              >
                <code>{generatedMy}</code>
              </button>
              <p>{copyStateMy === "copied" ? "Copied to clipboard" : "Click ID to copy"}</p>
            </div>
          </article>
        </section>
      )}

      {countryPage === "hk" && (
        <section className="nric-tools">
          <article className="tool-card">
            <h2>Hong Kong HKID Validator</h2>
            <p>Checks format and checksum for one/two-letter HKID values.</p>
            <label htmlFor="hkid-input">HKID value</label>
            <input
              id="hkid-input"
              className="tool-input"
              value={valueToValidateHk}
              onChange={(event) => setValueToValidateHk(event.target.value)}
              placeholder="e.g. A123456-7 or AB123456(9)"
            />
            {valueToValidateHk.trim() ? (
              <div
                className={validationResultHk.valid ? "result ok" : "result bad"}
                role="status"
              >
                <strong>{validationResultHk.valid ? "Valid" : "Invalid"}</strong>
                <p>Normalized: {validationResultHk.normalized}</p>
                {!validationResultHk.valid && validationResultHk.reason && (
                  <p>{validationResultHk.reason}</p>
                )}
              </div>
            ) : (
              <div className="result neutral">Enter a value to validate.</div>
            )}
          </article>

          <article className="tool-card">
            <h2>Hong Kong HKID Generator</h2>
            <p>Generates one sample HKID style value with checksum.</p>
            <button
              className="logic-button"
              onClick={() => setLogicPopup("hk")}
              type="button"
            >
              View generation logic
            </button>
            <div className="option-group">
              <label>Prefix mode</label>
              <div className="option-row">
                <button
                  className={hkPrefixMode === "auto" ? "is-active" : ""}
                  onClick={() => setHkPrefixMode("auto")}
                  type="button"
                >
                  Auto
                </button>
                <button
                  className={hkPrefixMode === "one" ? "is-active" : ""}
                  onClick={() => setHkPrefixMode("one")}
                  type="button"
                >
                  One letter
                </button>
                <button
                  className={hkPrefixMode === "two" ? "is-active" : ""}
                  onClick={() => setHkPrefixMode("two")}
                  type="button"
                >
                  Two letters
                </button>
              </div>
              <label className="checkbox-row">Check digit format</label>
              <div className="option-row">
                <button
                  className={hkCheckDigitFormat === "hyphen" ? "is-active" : ""}
                  onClick={() => setHkCheckDigitFormat("hyphen")}
                  type="button"
                >
                  Hyphen
                </button>
                <button
                  className={hkCheckDigitFormat === "parentheses" ? "is-active" : ""}
                  onClick={() => setHkCheckDigitFormat("parentheses")}
                  type="button"
                >
                  Parentheses
                </button>
              </div>
            </div>
            <div className="generator-controls">
              <span />
              <button
                type="button"
                onClick={() => {
                  setGeneratedHk(
                    generateHongKongId({
                      prefixMode: hkPrefixMode,
                      checkDigitFormat: hkCheckDigitFormat,
                    }),
                  );
                  setCopyStateHk("idle");
                }}
              >
                Generate New One
              </button>
            </div>
            <div className="generated-single">
              <button
                className="generated-value"
                onClick={() => copyGeneratedValue(generatedHk, setCopyStateHk)}
                title="Click to copy"
                type="button"
              >
                <code>{generatedHk}</code>
              </button>
              <p>{copyStateHk === "copied" ? "Copied to clipboard" : "Click ID to copy"}</p>
            </div>
          </article>
        </section>
      )}

      {logicPopup && (
        <div className="logic-modal-overlay" role="dialog" aria-modal="true">
          <div className="logic-modal">
            <h3>{logicTitleByCountry[logicPopup]}</h3>
            <ul>
              {logicTextByCountry[logicPopup].map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button onClick={() => setLogicPopup(null)} type="button">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
