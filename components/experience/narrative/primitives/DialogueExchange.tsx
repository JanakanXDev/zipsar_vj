import { cn } from "@/lib/cn";
import type { DialogueLine } from "@/content/contentBible";

/**
 * Chat-style dialogue (Acts 1 & 3 — Blueprint §8.3): visible speaker
 * labels, semantic list markup. Each bubble carries `js-bubble` for the
 * parent section's scoped timeline.
 */
export function DialogueExchange({
  messages,
  className,
}: {
  messages: readonly DialogueLine[];
  className?: string;
}) {
  return (
    <ul role="list" className={cn("flex flex-col gap-6", className)}>
      {messages.map((message) => {
        const isZipsar = message.speaker === "Zipsar";
        return (
          <li
            key={`${message.speaker}-${message.line}`}
            className={cn("js-bubble flex w-full", isZipsar ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "rounded-panel max-w-[85%] px-6 py-4 sm:max-w-[70%]",
                isZipsar
                  ? "glass neon-edge-blue origin-bottom-right"
                  : "glass-subtle border-line origin-bottom-left",
              )}
            >
              <p
                className={cn(
                  "overline-label mb-2",
                  isZipsar ? "text-neon-blue-soft" : "text-faint",
                )}
              >
                {message.speaker}
              </p>
              <p className="text-lead text-foreground">{message.line}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
