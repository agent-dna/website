import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  KeyRound,
  Loader2,
  Mail,
  Send,
} from "lucide-react";

/**
 * BetaAccess — Cohort 02 access form.
 *
 * Layout:
 *   - Centered header (eyebrow chip with pulsing dot, title with accent
 *     underline on "beta access", supporting copy)
 *   - 2-column grid below: value side (3 points + seats meter) | form card
 *   - Success state replaces the form card with a check ring + ticket
 *
 * Submits { name, email, message } as JSON to BETA_API_URL. While the
 * endpoint is empty, the success flow is simulated so the rest of the UI
 * can be tested end-to-end.
 */

const BETA_API_BASE = import.meta.env.VITE_API_BASE ?? "";
const BETA_API_URL = BETA_API_BASE ? `${BETA_API_BASE}/admin/add-user` : "";

type Status = "idle" | "submitting" | "success";

export function BetaAccess() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string | null>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [ticket, setTicket] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!email.trim()) e.email = "Please enter your work email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "That doesn't look like a valid email";
    if (!message.trim()) e.message = "Tell us a bit about your use case";
    return e;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus("submitting");

    const issueTicket = () => {
      const id =
        "AD-" +
        Math.random().toString(36).slice(2, 6).toUpperCase() +
        "-" +
        Math.random().toString(36).slice(2, 6).toUpperCase();
      setTicket(id);
      setSubmittedAt(new Date().toISOString().slice(0, 19) + "Z");
      setSubmittedEmail(email);
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    };

    if (!BETA_API_URL) {
      // Endpoint not configured yet — simulate the round-trip so the
      // success UI is still demoable during integration.
      window.setTimeout(issueTicket, 900);
      return;
    }

    try {
      const credentials = btoa(
        `${import.meta.env.VITE_ADMIN_USER}:${import.meta.env.VITE_ADMIN_PASS}`
      );
      await fetch(BETA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`,
        },
        body: JSON.stringify({ email, name }),
      });
      issueTicket();
    } catch (_err) {
      issueTicket();
    }
  }

  return (
    <section
      id="beta"
      className="relative overflow-hidden bg-white py-24"
    >
      {/* radial wash + subtle grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, #E6EFFF 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 90% 100%, #EAF0FF 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(47,109,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,109,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)",
          }}
        />
      </div>

      <div className="container-page relative">
        {/* ---------- Centered header ---------- */}
        <div className="mx-auto max-w-[760px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-electric-50 px-4 py-2 text-[13px] font-semibold tracking-[0.01em] text-electric-700">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-electric-500/70" />
            </span>
            PRIVATE BETA
          </span>
          <h2 className="mt-6 font-display text-[clamp(40px,5.4vw,64px)] font-bold leading-[1.04] tracking-[-0.025em] text-navy-500">
            Get{" "}
            <span className="relative inline-block text-electric-600">
              beta access
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[0.08em] h-[3px] rounded-[2px]"
                style={{ background: "#6BA8FF" }}
              />
            </span>
            <br />
            to AgentDNA.
          </h2>
          {/* <p className="mx-auto mt-5 max-w-[560px] text-[18px] leading-relaxed text-ink-subtle">
            We're onboarding 14 design partners shipping AI agents into production. Tell us what you're building 
             we'll be in touchwithin 48 hours.
          </p> */}
        </div>

        {/* ---------- Two-column body ---------- */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-16">
          {/* Left — form card / success (moved from right) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="rounded-[18px] border border-soft-200 bg-white p-5 transition-colors hover:border-navy-500 sm:p-6"
            style={{
              boxShadow:
                "0 1px 0 rgba(10,31,61,0.02), 0 20px 50px -24px rgba(10,31,61,0.18), 0 8px 20px -16px rgba(10,31,61,0.10)",
            }}
          >
            {status === "success" ? (
              <Success
                ticket={ticket}
                email={submittedEmail}
                at={submittedAt}
              />
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-3.5"
              >
                <div className="mb-1">
                  <h3 className="text-[18px] font-bold leading-tight tracking-[-0.015em] text-navy-500">
                    Request beta access
                  </h3>
                  <p className="mt-1 text-[13px] leading-[1.5] text-ink-subtle">
                    Tell us about your agents and we'll be in touch.
                  </p>
                </div>

                <Field
                  label="Name"
                  required
                  value={name}
                  onChange={(v) => {
                    setName(v);
                    if (errors.name) setErrors((e) => ({ ...e, name: null }));
                  }}
                  placeholder="Ada Lovelace"
                  error={errors.name ?? null}
                  autoComplete="name"
                  disabled={status === "submitting"}
                />
                <Field
                  label="Work email"
                  required
                  type="email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v);
                    if (errors.email) setErrors((e) => ({ ...e, email: null }));
                  }}
                  placeholder="ada@yourcompany.com"
                  error={errors.email ?? null}
                  autoComplete="email"
                  disabled={status === "submitting"}
                />
                <Field
                  label="Message"
                  required
                  multiline
                  value={message}
                  onChange={(v) => {
                    setMessage(v);
                    if (errors.message)
                      setErrors((e) => ({ ...e, message: null }));
                  }}
                  placeholder="What are you building? What's your team's biggest agent-security problem right now?"
                  error={errors.message ?? null}
                  disabled={status === "submitting"}
                />

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-electric-500 px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-electric-600 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    boxShadow:
                      "0 12px 28px -10px rgba(47,109,255,0.55)",
                  }}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send request
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-[3px]" />
                    </>
                  )}
                </button>

<p className="text-center text-[11.5px] leading-[1.5] text-ink-mute">
                  By sending you agree to our{" "}
                  <a
                    href="#"
                    className="text-ink-subtle underline decoration-soft-200 underline-offset-2 hover:text-electric-600 hover:decoration-electric-600"
                  >
                    privacy notice
                  </a>
                  . No spam — one follow-up, max.
                </p>
              </form>
            )}
          </motion.div>

          {/* Right — How it works panel */}
          <div className="relative pt-2">
            {/* Mini eyebrow with leading dash */}
            <span className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-electric-600">
              <span aria-hidden className="h-[1.5px] w-[22px] rounded-[2px] bg-electric-600" />
              How it works
            </span>

            {/* <h3 className="max-w-[16ch] font-display text-[clamp(28px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-0.022em] text-navy-500">
              Built for teams shipping agents into production.
            </h3> */}
            {/* <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-ink-subtle">
              Get early access to the control plane that brings identity,
              authorization, and provenance to every agent action — before
              they scale beyond control.
            </p> */}

            {/* ---------- Steps timeline ---------- */}
            <div className="relative mt-11 grid gap-3.5">
              {/* dotted vertical connector */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-[22px] top-[22px] bottom-[22px] w-[2px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #E6EFFF 0, #E6EFFF 4px, transparent 4px, transparent 8px)",
                  backgroundSize: "100% 8px",
                  backgroundRepeat: "repeat-y",
                }}
              />

              {[
                {
                  tag: "Step 01 · now",
                  Icon: Send,
                  title: "Submit your request",
                  body:
                    "Share your name, email, and what you want the keys for - testing, building, exploring, anything in between.",
                },
                {
                  tag: "Step 02 · 24h",
                  Icon: Mail,
                  title: "Receive your keys",
                  body:
                    "Your beta keys will land in your inbox within 24 hours.",
                },
                {
                  tag: "Step 03 · ongoing",
                  Icon: KeyRound,
                  title: "Integrate & secure",
                  body:
                    "Use the key to install the package and bring identity, authorization, and provenance to every agent action.",
                },
              ].map(({ tag, Icon, title, body }, i) => {
                const active = i === 0;
                return (
                  <div
                    key={tag}
                    className="group relative grid items-start gap-[18px] rounded-xl py-3.5 pr-4 transition-colors hover:bg-electric-500/[0.03]"
                    style={{ gridTemplateColumns: "44px 1fr" }}
                  >
                    {/* numbered badge */}
                    <div
                      className={`relative z-[1] grid h-11 w-11 place-items-center rounded-full font-mono text-[15px] font-semibold transition-all group-hover:border-electric-500 group-hover:bg-electric-500 group-hover:text-white ${
                        active
                          ? "border-electric-500 bg-electric-500 text-white"
                          : "border-electric-100 bg-white text-electric-600"
                      }`}
                      style={{
                        borderWidth: 1.5,
                        borderStyle: "solid",
                        boxShadow: active
                          ? "0 6px 18px -4px rgba(47,109,255,0.5)"
                          : "0 4px 14px -6px rgba(47,109,255,0.25)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* body */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2.5">
                        <span className="rounded-full bg-electric-50 px-2.5 py-[3px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-electric-600">
                          {tag}
                        </span>
                        <span className="inline-flex text-ink-mute">
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                      <p className="text-[15.5px] font-semibold leading-[1.35] tracking-[-0.008em] text-navy-500">
                        {title}
                      </p>
                      <p className="mt-1.5 text-[14.5px] leading-[1.55] text-ink-subtle">
                        {body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---------- Cohort callout ---------- */}
            {/* <div
              className="relative mt-2 flex items-center gap-3.5 overflow-hidden rounded-xl border px-[18px] py-4"
              style={{
                borderColor: "rgba(47,109,255,0.18)",
                background:
                  "linear-gradient(135deg, rgba(47,109,255,0.06), rgba(107,168,255,0.04))",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-[40%] -right-[10%] h-[180px] w-[180px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(47,109,255,0.18), transparent 60%)",
                }}
              />
              <div
                className="relative grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-electric-500 text-white"
                style={{
                  boxShadow: "0 6px 16px -4px rgba(47,109,255,0.5)",
                }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="relative">
                <p className="m-0 text-[14px] font-semibold tracking-[-0.005em] text-navy-500">
                  14 seats in cohort 02
                </p>
                <p className="m-0 font-mono text-[12.5px] text-ink-subtle">
                  <span className="font-semibold text-electric-600">10</span>{" "}
                  filled ·{" "}
                  <span className="font-semibold text-electric-600">4</span> open
                </p>
              </div>
            </div> */}

            {/* <ul className="mt-9 grid gap-5">
              {[
                {
                  Icon: KeyRound,
                  title: "Cryptographic identity per agent",
                  body: "Replace shared API keys with short-lived, DID-bound credentials issued per task.",
                },
                {
                  Icon: ShieldCheck,
                  title: "Scoped, just-in-time authorization",
                  body: "Policy that re-evaluates at every tool call. No org-wide tokens sitting in agent memory.",
                },
                {
                  Icon: Zap,
                  title: "Tamper-evident provenance",
                  body: "Every action signed and chained — auditable from human intent down to the API call.",
                },
              ].map(({ Icon, title, body }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-electric-50 text-electric-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-[15.5px] font-semibold tracking-[-0.005em] text-navy-500">
                      {title}
                    </p>
                    <p className="mt-1 text-[14.5px] leading-[1.55] text-ink-subtle">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul> */}

          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- field ---------- */

function Field({
  label,
  required,
  type = "text",
  multiline,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  disabled,
}: {
  label: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string | null;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const base =
    "w-full rounded-xl border bg-white px-3.5 py-3 text-[15px] text-navy-500 outline-none transition-all placeholder:text-ink-mute hover:border-[#A8B8D4] focus:border-electric-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(47,109,255,0.14)] disabled:cursor-not-allowed disabled:opacity-60";
  const borderClass = error
    ? "border-rose-400 bg-rose-50/40"
    : "border-[#CFD9EB]";
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold tracking-[-0.005em] text-navy-500">
        {label}
        {required && <span className="ml-0.5 text-electric-600">*</span>}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${base} ${borderClass} min-h-[130px] resize-y leading-[1.5]`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`${base} ${borderClass}`}
        />
      )}
      {error && (
        <p className="mt-1.5 text-[12.5px] font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- success ---------- */

function Success({
  // ticket,
  // email,
  // at,
}: {
  ticket: string;
  email: string;
  at: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-1 py-2 text-center"
    >
      <div className="relative mx-auto grid h-[72px] w-[72px] place-items-center rounded-full bg-electric-50 text-electric-600">
        <Check className="h-[30px] w-[30px]" strokeWidth={2.2} />
        <span
          aria-hidden
          className="absolute -inset-1.5 rounded-full border border-dashed"
          style={{
            borderColor: "#6BA8FF",
            animation: "spin 12s linear infinite",
          }}
        />
      </div>
      <h3 className="mt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-navy-500">
        You're on the list.
      </h3>
      <p className="mx-auto mt-2 max-w-[38ch] text-[14.5px] leading-[1.55] text-ink-subtle">
        Your key is on its way. 
      </p>
      {/* <div className="mt-5 inline-block rounded-xl border border-dashed border-[#CFD9EB] bg-soft-50 px-4 py-3 text-left font-mono text-[12px] text-ink-subtle">
        request_id: <span className="text-electric-600">{ticket}</span>
        <br />
        queued_at: <span className="text-electric-600">{at}</span>
        <br />
        principal: <span className="text-electric-600">{email}</span>
      </div> */}
    </motion.div>
  );
}
