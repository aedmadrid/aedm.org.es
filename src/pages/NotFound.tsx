import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Botón } from "../components/Botón";
import type {
  NotionBlock,
  NotionPageResponse,
  RichTextItem,
} from "../types/notion";

type FetchState = "idle" | "loading" | "success" | "error" | "not-found";

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

const applyColorStyles = (color: string) => {
  if (!color || color === "default") {
    return {};
  }

  if (color.endsWith("_background")) {
    const base = color.replace("_background", "");
    return {
      backgroundColor: COLOR_BG_HEX[base] ?? COLOR_BG_HEX.gray,
      color: COLOR_HEX[base] ?? "#202020",
    };
  }

  return {
    color: COLOR_HEX[color] ?? color,
  };
};

const renderRichText = (items: RichTextItem[]): ReactNode => {
  if (!items.length) {
    return <span>&nbsp;</span>;
  }

  return items.map((item, index) => {
    const key = `${item.plain_text}-${index}`;
    const styles: React.CSSProperties = {
      fontWeight: item.annotations.bold ? 600 : undefined,
      fontStyle: item.annotations.italic ? "italic" : undefined,
      textDecoration:
        [
          item.annotations.underline ? "underline" : "",
          item.annotations.strikethrough ? "line-through" : "",
        ]
          .filter(Boolean)
          .join(" ") || undefined,
      ...applyColorStyles(item.annotations.color),
    };

    const content = item.plain_text || "\u00A0";

    if (item.href) {
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

const getPlainText = (items: RichTextItem[]) =>
  items.map((item) => item.plain_text).join("");

const renderBlock = (block: NotionBlock): ReactNode => {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={block.id} className="notion-block paragraph">
          {renderRichText(block.rich_text)}
        </p>
      );

    case "heading_1":
      return (
        <h1 key={block.id} className="notion-block heading-1">
          {renderRichText(block.rich_text)}
        </h1>
      );

    case "heading_2":
      return (
        <h2 key={block.id} className="notion-block heading-2">
          {renderRichText(block.rich_text)}
        </h2>
      );

    case "heading_3":
      return (
        <h3 key={block.id} className="notion-block heading-3">
          {renderRichText(block.rich_text)}
        </h3>
      );

    case "bulleted_list_item":
      return (
        <ul key={block.id} className="notion-block bulleted-list">
          <li>{renderRichText(block.rich_text)}</li>
        </ul>
      );

    case "to_do":
      return (
        <label key={block.id} className="notion-block todo-item">
          <input type="checkbox" defaultChecked={block.checked} readOnly />
          <span>{renderRichText(block.rich_text)}</span>
        </label>
      );

    case "quote":
      return (
        <blockquote key={block.id} className="notion-block quote">
          {renderRichText(block.rich_text)}
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
          <code data-language={block.language}>
            {getPlainText(block.rich_text)}
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
          />
        </div>
      );

    case "child_page":
      return (
        <article key={block.id} className="notion-block child-page">
          <h4>{block.title}</h4>
          <p>Esta es una subpágina enlazada desde Notion.</p>
        </article>
      );

    case "image":
      return (
        <figure key={block.id} className="notion-block image">
          <img src={block.url} alt={getPlainText(block.caption)} />
          {block.caption.length > 0 && (
            <figcaption>{renderRichText(block.caption)}</figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
};

const NotFound: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<FetchState>("idle");
  const [page, setPage] = useState<NotionPageResponse | null>(null);
  const [message, setMessage] = useState<string>("");

  const pageId = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments[0] === "id" && segments[1]) {
      return segments[1];
    }
    return null;
  }, [location.pathname]);

  useEffect(() => {
    if (!pageId) {
      setStatus("not-found");
      setPage(null);
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setMessage("");

    fetch(`/id/${pageId}.json`, { signal: controller.signal })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("NOT_FOUND");
        }
        if (!response.ok) {
          throw new Error(`HTTP_${response.status}`);
        }
        return response.json();
      })
      .then((data: NotionPageResponse) => {
        setPage(data);
        setStatus("success");
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") {
          return;
        }
        if (error.message === "NOT_FOUND") {
          setStatus("not-found");
          setPage(null);
          return;
        }
        console.error("Error fetching page:", error);
        setStatus("error");
        setMessage("No hemos podido cargar la página solicitada.");
      });

    return () => controller.abort();
  }, [pageId]);

  if (pageId) {
    if (status === "loading" || status === "idle") {
      return (
        <main>
          <h1>Cargando página…</h1>
          <p>Accediendo a la página solicitada...</p>
        </main>
      );
    }

    if (status === "success" && page) {
      return (
        <main>
          <header>
            <h1>{page.current_page_title}</h1>
          </header>

          <section>{page.blocks.map((block) => renderBlock(block))}</section>
        </main>
      );
    }

    if (status === "error") {
      return (
        <main>
          <h1>Ups…</h1>
          <p>{message}</p>
          <Botón texto="Volver al inicio" enlace="/" />
        </main>
      );
    }
  }

  return (
    <main>
      <h1>Error 404</h1>
      <p>Lo sentimos, la página que buscas no se ha encontrado.</p>
      <Botón texto="Ir a la página de inicio" enlace="/" />
    </main>
  );
};

export default NotFound;
