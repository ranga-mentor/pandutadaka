import { useCallback, useEffect, useState } from "react";

const HF_BLOG_RSS_URL = "https://huggingface.co/blog/feed.xml";
const RSS_PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(HF_BLOG_RSS_URL)}`;

type FeedItem = {
  title: string;
  link: string;
  publishedAt: string;
};

function parseFeed(xml: string): FeedItem[] {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror")) {
    throw new Error("The feed response could not be read.");
  }

  return Array.from(document.querySelectorAll("item"))
    .slice(0, 18)
    .map((item) => ({
      title: item.querySelector("title")?.textContent?.trim() ?? "Untitled post",
      link: item.querySelector("link")?.textContent?.trim() ?? "",
      publishedAt: item.querySelector("pubDate")?.textContent?.trim() ?? "",
    }))
    .filter((item) => item.link);
}

function formatPublishedAt(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
}

export default function HuggingFaceFeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const loadFeed = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch(RSS_PROXY_URL);
      if (!response.ok) {
        throw new Error(`Feed request failed with ${response.status}.`);
      }
      const nextItems = parseFeed(await response.text());
      if (nextItems.length === 0) {
        throw new Error("No posts were found in the feed.");
      }
      setItems(nextItems);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  return (
    <section className="workspace-shell hf-feed-shell">
      <div className="workspace-head hf-feed-heading">
        <div>
          <p className="hf-feed-kicker">Official RSS</p>
          <h2>Hugging Face Blog</h2>
        </div>
        <button className="hf-feed-refresh" type="button" onClick={() => void loadFeed()} disabled={status === "loading"}>
          {status === "loading" ? "Loading" : "Refresh"}
        </button>
      </div>

      <article className="tool-card hf-feed-intro">
        <p>
          Latest posts from the Hugging Face Blog. Open any post for the full article, or subscribe in your preferred RSS reader.
        </p>
        <a href={HF_BLOG_RSS_URL} target="_blank" rel="noreferrer">Open RSS feed</a>
      </article>

      {status === "error" && (
        <article className="tool-card hf-feed-error">
          <h3>Feed unavailable</h3>
          <p>Try refreshing, or open the RSS feed directly.</p>
        </article>
      )}

      {status !== "error" && (
        <div className="hf-feed-list" aria-busy={status === "loading"}>
          {status === "loading" && Array.from({ length: 6 }, (_, index) => (
            <article className="hf-feed-item hf-feed-placeholder" key={index} aria-hidden="true">
              <span />
              <span />
            </article>
          ))}
          {status === "ready" && items.map((item) => (
            <article className="hf-feed-item" key={item.link}>
              <p>{formatPublishedAt(item.publishedAt)}</p>
              <h3><a href={item.link} target="_blank" rel="noreferrer">{item.title}</a></h3>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
