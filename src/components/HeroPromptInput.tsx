import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

/**
 * Compact chat-style prompt that types itself out, "submits", then sits in
 * a submitted state. When the `prompt` prop changes (workflow rotation),
 * the typewriter restarts cleanly.
 */

type Props = {
  prompt: string;
  /** Workflow-specific note rendered under the prompt input. */
  supportLine: string;
  /** Once true, the submit button locks into the submitted state. */
  submitted: boolean;
  /** Display username next to the prompt. */
  user?: string;
  /** Re-key the typewriter when this changes so the prompt retypes. */
  cycleKey?: string | number;
};

export function HeroPromptInput({
  prompt,
  supportLine,
  submitted,
  user = "alice@acme.com",
  cycleKey,
}: Props) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(prompt.slice(0, i));
      if (i >= prompt.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [prompt, cycleKey]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-soft-200 bg-white/95 p-4 shadow-soft backdrop-blur">
      <div className="mb-3 flex items-center gap-2 px-1">
        <Sparkles className="h-3 w-3 text-electric-600" />
        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ink-mute">
          User Prompt
        </span>
        <span className="ml-auto truncate font-mono text-[9.5px] text-ink-mute">
          {user}
        </span>
      </div>
      <div className="flex items-start gap-2.5 rounded-xl border border-soft-200 bg-white px-3.5 py-3">
        <p className="min-h-[3em] flex-1 text-[13px] font-medium leading-snug text-navy-500">
          <span>{typed}</span>
          {!submitted && typed.length < prompt.length && (
            <span className="ml-0.5 inline-block h-3 w-[2px] -translate-y-0.5 bg-electric-500 align-middle animate-caret" />
          )}
        </p>
        <motion.button
          aria-label="Submit prompt"
          initial={false}
          animate={
            submitted
              ? { background: "#2D7DFF", color: "#FFFFFF", scale: [1, 1.05, 1] }
              : { background: "#EAF2FF", color: "#1D5FD9" }
          }
          transition={{ duration: 0.5 }}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg"
        >
          <Send className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      {/* Workflow-specific expansion note describing what systems
          this request will reach. Comes from the selected workflow. */}
      <p className="mt-3 px-1 text-[10px] leading-relaxed text-ink-mute">
        {supportLine}
      </p>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-auto flex items-center gap-1.5 px-1 pt-2.5 font-mono text-[9.5px] text-electric-700"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-electric-500 opacity-60" />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-electric-500" />
          </span>
          submitted · workflow triggered
        </motion.div>
      )}
    </div>
  );
}
