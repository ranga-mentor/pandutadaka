import CalloutBox from "./CalloutBox";
import CodeBlock from "./CodeBlock";
import type { ChapterType } from "../content";

interface ChapterProps {
  chapter: ChapterType;
}

export default function Chapter({ chapter }: ChapterProps) {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>{chapter.title}</h2>
      <p>{chapter.text}</p>
      {chapter.code && <CodeBlock code={chapter.code} />}
      {chapter.callouts && chapter.callouts.map((c, idx) => (
        <CalloutBox key={idx} {...c} />
      ))}
      {chapter.diagrams && chapter.diagrams.map((img, idx) => (
        <img key={idx} src={img} alt="diagram" style={{ maxWidth: "100%", marginTop: "12px" }} />
      ))}
    </section>
  );
}
