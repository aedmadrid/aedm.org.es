import React, { useState, useEffect, useRef, useCallback } from "react";
import Masonry from "masonry-layout";
import { Botón } from "./Botón";

// Types
interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  thumbnail?: string;
  description?: string;
  enclosure?: { link?: string };
}

interface SubstackFeedProps {
  feedUrl?: string;
  maxPosts?: number;
  substackUrl?: string;
}

// Utility function to extract image from HTML
const extractImageFromHTML = (html?: string): string | undefined => {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
};

// FeedCard subcomponent
const FeedCard: React.FC<{ item: RSSItem }> = ({ item }) => {
  const imageUrl =
    item.thumbnail ||
    item.enclosure?.link ||
    extractImageFromHTML(item.description);

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <article
        style={{
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          breakInside: "avoid",
          marginBottom: "1rem",
          cursor: "pointer",
          transition: "box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.title}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        )}
        <div style={{ padding: "1rem", textAlign: "left" }}>
          <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>{item.title}</h3>
          {item.description && (
            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "0.9rem",
                lineHeight: 1.4,
              }}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}
        </div>
      </article>
    </a>
  );
};

// Main SubstackFeed component
export const SubstackFeed: React.FC<SubstackFeedProps> = ({
  feedUrl = "https://asoesdm.substack.com/feed",
  maxPosts = 10,
  substackUrl = "https://asoesdm.substack.com/",
}) => {
  const [posts, setPosts] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<Masonry | null>(null);

  // Initialize and update Masonry
  const initMasonry = useCallback(() => {
    if (gridRef.current && posts.length > 0 && window.innerWidth >= 768) {
      // Destroy existing instance
      if (
        masonryRef.current &&
        typeof masonryRef.current.destroy === "function"
      ) {
        masonryRef.current.destroy();
      }
      // Create new Masonry instance
      masonryRef.current = new Masonry(gridRef.current, {
        itemSelector: ".feed-card",
        columnWidth: ".feed-card",
        percentPosition: true,
        gutter: 16,
        horizontalOrder: true, // Row-based ordering
      });
    }
  }, [posts]);

  // Re-layout on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        initMasonry();
      } else if (
        masonryRef.current &&
        typeof masonryRef.current.destroy === "function"
      ) {
        masonryRef.current.destroy();
        masonryRef.current = null;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initMasonry]);

  // Initialize Masonry after posts load
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMasonry();
    }, 100);
    return () => clearTimeout(timer);
  }, [posts, initMasonry]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const encodedUrl = encodeURIComponent(feedUrl);
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodedUrl}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const items: RSSItem[] = Array.isArray(data.items) ? data.items : [];
        setPosts(items.slice(0, maxPosts));
        setError(null);
      } catch (e) {
        setError("No se pudo cargar el feed.");
        console.error("RSS fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [feedUrl, maxPosts]);

  if (loading) {
    return <p style={{ color: "#666", textAlign: "left" }}>Cargando…</p>;
  }

  if (error) {
    return <p style={{ color: "tomato", textAlign: "left" }}>{error}</p>;
  }

  if (posts.length === 0) {
    return (
      <p style={{ color: "#666", textAlign: "left" }}>
        No hay publicaciones disponibles.
      </p>
    );
  }

  return (
    <>
      <div ref={gridRef} className="substack-feed-grid">
        {posts.map((item, idx) => (
          <div key={item.link || idx} className="feed-card">
            <FeedCard item={item} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <Botón enlace={substackUrl} texto="Ver más posts" />
      </div>
    </>
  );
};

export default SubstackFeed;
