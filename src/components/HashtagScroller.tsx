import React, { useEffect, useMemo, useState } from "react";

export interface HashtagScrollerRow {
  hashtags: string[];
  direction?: "left" | "right";
  duration?: number;
  clickable?: boolean;
}

export interface HashtagScrollerProps {
  rows: HashtagScrollerRow[];
  onHashtagClick?: (tag: string) => void;
  duplicateCount?: number;
  className?: string;
}

const MOBILE_BREAKPOINT = 640;
const DEFAULT_DIRECTION: HashtagScrollerRow["direction"] = "left";
const DEFAULT_DURATION = 20;
const DEFAULT_DUPLICATE_COUNT = 2;

const buildLoopedHashtags = (hashtags: string[], loops: number) => {
  const safeLoops = Number.isFinite(loops) ? Math.max(1, loops) : 1;
  const output: string[] = [];

  for (let i = 0; i < safeLoops; i += 1) {
    output.push(...hashtags);
  }

  return output;
};

const useIsMobile = (breakpoint: number) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    setIsMobile(mediaQuery.matches);

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [breakpoint]);

  return isMobile;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => {
      if (typeof window === "undefined") {
        return false;
      }
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    setPrefersReducedMotion(mediaQuery.matches);

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

export const HashtagScroller: React.FC<HashtagScrollerProps> = ({
  rows,
  onHashtagClick,
  duplicateCount = DEFAULT_DUPLICATE_COUNT,
  className = "",
}) => {
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const animationState = shouldAnimate ? "loop" : "static";
  const shouldUseMobileLayout = isMobile && !shouldAnimate;
  const clickable = typeof onHashtagClick === "function";

  const normalizedRows = useMemo(
    () =>
      rows.filter(
        (row) => Array.isArray(row.hashtags) && row.hashtags.length > 0,
      ),
    [rows],
  );

  const sequences = useMemo(
    () =>
      normalizedRows.map((row) =>
        shouldAnimate
          ? buildLoopedHashtags(row.hashtags, duplicateCount)
          : row.hashtags,
      ),
    [normalizedRows, shouldAnimate, duplicateCount],
  );

  if (!normalizedRows.length) {
    return null;
  }

  return (
    <div
      className={["aso-hashtag-scroller", className].filter(Boolean).join(" ")}
      data-mobile={isMobile}
      data-reduced-motion={prefersReducedMotion}
      data-animation={animationState}
    >
      {normalizedRows.map((row, rowIndex) => {
        const direction = row.direction ?? DEFAULT_DIRECTION;
        const duration = row.duration ?? DEFAULT_DURATION;
        const sequence = sequences[rowIndex] ?? [];
        const rowAllowsClick = row.clickable ?? true;
        const isRowInteractive = clickable && rowAllowsClick;
        const animation = shouldAnimate
          ? `aso-hashtag-scroll-${direction} ${duration}s linear infinite`
          : undefined;

        return (
          <div
            className="aso-hashtag-row-wrapper"
            key={`aso-hashtag-row-${rowIndex}`}
            data-direction={direction}
            data-duration={duration}
            data-mobile={isMobile}
          >
            <div
              className={[
                "aso-hashtag-row",
                `aso-hashtag-row--${direction}`,
                shouldUseMobileLayout
                  ? "aso-hashtag-row--mobile"
                  : "aso-hashtag-row--desktop",
                shouldAnimate
                  ? "aso-hashtag-row--animated"
                  : "aso-hashtag-row--static",
              ].join(" ")}
              data-direction={direction}
              data-duration={duration}
              style={animation ? { animation } : undefined}
            >
              {sequence.map((tag, pillIndex) =>
                isRowInteractive ? (
                  <button
                    key={`aso-hashtag-pill-${rowIndex}-${pillIndex}`}
                    type="button"
                    className="aso-hashtag-pill"
                    data-clickable={isRowInteractive}
                    aria-label={`Filtrar por ${tag}`}
                    onClick={() => {
                      onHashtagClick?.(tag);
                    }}
                  >
                    {tag}
                  </button>
                ) : (
                  <span
                    key={`aso-hashtag-pill-${rowIndex}-${pillIndex}`}
                    className="aso-hashtag-pill"
                    data-clickable={false}
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HashtagScroller;
