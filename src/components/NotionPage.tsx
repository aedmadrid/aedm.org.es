import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type {
  NotionBlock,
  NotionPageResponse,
  RichTextItem,
} from "../types/notion";
import { Botón } from "./Botón";
import { DotLoader } from "react-spinners";
import { HClick } from "./HClick";
import { GranBotón } from "./GranBotón";

/* Base URL used to fetch page JSON. In production it points to the API host,
   in development we assume the same origin (empty string). */
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api.aedm.org.es" : "";

const COLOR_HEX: Record<string, string> = {
  gray: "#9B9A97",
  brown: "#7B4B25",
  orange: "#D9730D",
  yellow: "#DFAB01",
  green: "#0F7B6C",
  blue: "#0B6E99",
  purple: "#6940A5",
  pink: "#AD1A72",
  red: "#E03E3E",
};

const COLOR_BG_HEX: Record<string, string> = {
  gray: "#F1F1EF",
  brown: "#F4E6D4",
  orange: "#FEEEDA",
  yellow: "#FEF3C0",
  green: "#DDEDEA",
  blue: "#DDEBF1",
  purple: "#EAE4F2",
  pink: "#FBE4F0",
  red: "#FDEBEC",
};

const applyColorStyles = (color: string | undefined): React.CSSProperties => {
  if (!color || color === "default") return {};
  if (color.endsWith("_background")) {
    const base = color.replace("_background", "");
    return {
      backgroundColor: COLOR_BG_HEX[base] ?? COLOR_BG_HEX.gray,
      color: COLOR_HEX[base] ?? "#202020",
    };
  }
  return { color: COLOR_HEX[color] ?? color };
};

const renderRichText = (items: RichTextItem[] = []): ReactNode => {
  if (!items.length) return <span>&nbsp;</span>;

  return items.map((item, index) => {
    const key = `${item.plain_text ?? ""}-${index}`;
    const styles: React.CSSProperties = {
      fontWeight: item.annotations?.bold ? 600 : undefined,
      fontStyle: item.annotations?.italic ? "italic" : undefined,
      textDecoration:
        [
          item.annotations?.underline ? "underline" : "",
          item.annotations?.strikethrough ? "line-through" : "",
        ]
          .filter(Boolean)
          .join(" ") || undefined,
      ...applyColorStyles(item.annotations?.color),
    };

    const content = item.plain_text || "\u00A0";

    if (item.href) {
      // internal link (starts with '/') should use react-router Link
      if (item.href.startsWith("/")) {
        return (
          <Link key={key} to={item.href} style={styles}>
            {content}
          </Link>
        );
      }

      return (
        <a
          key={key}
          href={item.href}
          style={styles}
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <span key={key} style={styles}>
        {content}
      </span>
    );
  });
};

const getPlainText = (items: RichTextItem[] = []) =>
  items.map((item) => item.plain_text).join("");

const renderBlock = (block: NotionBlock): ReactNode => {
  // Defensive checks for union properties
  switch (block.type) {
    case "paragraph":
      return (
        <p key={block.id} className="notion-block paragraph">
          {renderRichText((block as any).rich_text)}
        </p>
      );

    case "heading_1":
      return (
        <h1 key={block.id} className="notion-block heading-1">
          {renderRichText((block as any).rich_text)}
        </h1>
      );

    case "heading_2": {
      // If the heading contains exactly one rich-text item and that item is a link,
      // render it as a large button (GranBotón) with the link as target.
      const rt = (block as any).rich_text ?? [];
      if (rt.length === 1 && rt[0].href) {
        const text = rt[0].plain_text || rt[0].href;
        return (
          <div key={block.id} className="notion-block heading-2">
            <GranBotón texto={text} enlace={rt[0].href} icono="arrow_forward" />
          </div>
        );
      }

      return (
        <h2 key={block.id} className="notion-block heading-2">
          {renderRichText((block as any).rich_text)}
        </h2>
      );
    }

    case "heading_3":
      return (
        <h3 key={block.id} className="notion-block heading-3">
          {renderRichText((block as any).rich_text)}
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li key={block.id} className="notion-block bulleted-list-item">
          {renderRichText((block as any).rich_text)}
        </li>
      );

    case "to_do":
      return (
        <label key={block.id} className="notion-block todo-item">
          <input
            type="checkbox"
            defaultChecked={!!(block as any).checked}
            readOnly
          />
          <span>{renderRichText((block as any).rich_text)}</span>
        </label>
      );

    case "quote":
      return (
        <blockquote key={block.id} className="notion-block quote">
          {renderRichText((block as any).rich_text)}
        </blockquote>
      );

    case "bookmark":
      return (
        <div key={block.id} className="notion-block bookmark">
          <a href={block.url} target="_blank" rel="noreferrer">
            {block.url}
          </a>
        </div>
      );

    case "code":
      return (
        <pre key={block.id} className="notion-block code-block">
          <code data-language={(block as any).language}>
            {getPlainText((block as any).rich_text)}
          </code>
        </pre>
      );

    case "divider":
      return <hr key={block.id} className="notion-block divider" />;

    case "embed":
      return (
        <div key={block.id} className="notion-block embed">
          <iframe
            src={block.url}
            title={`embed-${block.id}`}
            loading="lazy"
            allowFullScreen
            style={{ width: "100%", minHeight: 200, border: 0 }}
          />
        </div>
      );

    case "child_page":
      return (
        <article key={block.id} className="notion-block child-page">
          <HClick
            texto={block.title}
            enlace={`/id/${block.id}`}
            icono="arrow_forward"
          />
        </article>
      );

    case "image":
      return (
        <figure key={block.id} className="notion-block image">
          <img
            src={block.url}
            alt={getPlainText(block.caption)}
            style={{ maxWidth: "100%" }}
          />
          {block.caption && block.caption.length > 0 && (
            <figcaption>{renderRichText(block.caption)}</figcaption>
          )}
        </figure>
      );

    default:
      // Unknown/unsupported block
      return null;
  }
};

const renderBlocksGrouped = (blocks: NotionBlock[] = []): ReactNode[] => {
  // First pass: group blocks into "groups" (lists become a single group)
  const groups: { key: string; content: ReactNode }[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Group consecutive bulleted_list_item blocks into a single <ul>
    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }

      groups.push({
        key: `list-${items[0].id}`,
        content: (
          <ul className="notion-block bulleted-list">
            {items.map((it) => (
              <li key={it.id} className="notion-block bulleted-list-item">
                {renderRichText((it as any).rich_text)}
              </li>
            ))}
          </ul>
        ),
      });

      continue;
    }

    // Non-list block: render normally
    groups.push({
      key: block.id,
      content: renderBlock(block),
    });
    i++;
  }

  // Render groups without extra <br /> separators
  const out: ReactNode[] = [];
  for (let j = 0; j < groups.length; j++) {
    out.push(
      <React.Fragment key={groups[j].key}>{groups[j].content}</React.Fragment>,
    );
  }

  return out;
};

type FetchState = "idle" | "loading" | "success" | "error" | "not-found";

export let PageTitle = "";

const NotionPage: React.FC<{ pageId?: string }> = ({ pageId: propPageId }) => {
  const location = useLocation();
  const [status, setStatus] = useState<FetchState>("idle");
  const [page, setPage] = useState<NotionPageResponse | null>(null);
  const [message, setMessage] = useState<string>("");

  const pageIdFromLocation = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    // Support "/id/<pageId>" or "/id/<pageId>/..." (wildcard)
    if (segments[0] === "id" && segments[1]) return segments[1];
    return null;
  }, [location.pathname]);

  const pageId = propPageId ?? pageIdFromLocation;

  useEffect(() => {
    if (!pageId) {
      PageTitle = "";
      document.title = "aedm";
      setStatus("not-found");
      setPage(null);
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setMessage("");

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/id/${pageId}.json`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          PageTitle = "";
          document.title = "aedm";
          setStatus("not-found");
          setPage(null);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP_${res.status}`);
        }

        const data = (await res.json()) as NotionPageResponse;
        setPage(data);
        PageTitle = data.current_page_title;
        document.title = `${PageTitle} | aedm`;
        setStatus("success");
      } catch (error: unknown) {
        // Ignore aborts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any)?.name === "AbortError") return;

        console.error("Error fetching Notion page:", error);
        PageTitle = "";
        document.title = "aedm";
        setStatus("error");
        setMessage("No hemos podido cargar la página solicitada.");
      }
    })();

    return () => controller.abort();
  }, [pageId]);

  if (!pageId) {
    return (
      <main>
        <h1>Error 404</h1>
        <p>Lo sentimos, la página que buscas no se ha encontrado.</p>
        <Botón texto="Ir a la página de inicio" enlace="/" />
      </main>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <main
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DotLoader color="rgb(54, 228, 82)" />
      </main>
    );
  }

  if (status === "not-found") {
    return (
      <main>
        <h1>Página no encontrada</h1>
        <p>
          No se ha encontrado ninguna página con el identificador solicitado.
        </p>
        <Botón texto="Volver al inicio" enlace="/" />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main>
        <h1>Error 404</h1>
        <p>
          {message || "Lo sentimos, la página que buscas no se ha encontrado."}
        </p>
        <Botón texto="Volver al inicio" enlace="/" />
      </main>
    );
  }

  if (status === "success" && page) {
    // Safely extract tags in a way that does not rely on the NotionPageResponse type
    const tags =
      Array.isArray((page as any)?.tags) &&
      (page as any).tags.every((x: unknown) => typeof x === "string")
        ? ((page as any).tags as string[])
        : undefined;

    return (
      <main>
        <header>
          <h1>{page.current_page_title}</h1>
          {tags && tags.length > 0 && (
            <div className="notion-tags" style={{ marginTop: 8 }}>
              {tags.map((t: string) => (
                <span
                  key={t}
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    marginRight: 6,
                    borderRadius: 999,
                    background: "#f1f1f1",
                    fontSize: 12,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        <section style={{ marginTop: 16 }}>
          {page.blocks && page.blocks.length > 0 ? (
            renderBlocksGrouped(page.blocks)
          ) : (
            <p>La página no contiene contenido.</p>
          )}
        </section>
      </main>
    );
  }

  // Fallback
  return (
    <main>
      <h1>Estado desconocido</h1>
      <p>Estado inesperado al renderizar la página.</p>
      <Botón texto="Ir al inicio" enlace="/" />
    </main>
  );
};

export default NotionPage;
