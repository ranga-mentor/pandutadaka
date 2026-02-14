import type { Callout } from "../content";

export default function CalloutBox({ title, text, type }: Callout) {
  const colors: Record<string, string> = {
    note: "#FFFBE6",
    brain: "#F0F5FF",
    tip: "#F6FFED",
    warning: "#FFF1F0"
  };
  const borders: Record<string, string> = {
    note: "#FAAD14",
    brain: "#2F54EB",
    tip: "#52C41A",
    warning: "#FF4D4F"
  };
  return (
    <div style={{
      backgroundColor: colors[type],
      border: `2px solid ${borders[type]}`,
      padding: "10px",
      margin: "12px 0",
      borderRadius: "8px"
    }}>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
