/**
 * Person colors. The landing page gives three people three colors; the app
 * cycles the same three by member index so a face keeps its color everywhere
 * in a circle (host cards, member rail).
 */
const PERSON_COLORS = ["#c95a2e", "#2f6a64", "#6b3aa0"] as const;

export function personColor(index: number): string {
  if (index < 0) return PERSON_COLORS[0];
  return PERSON_COLORS[index % PERSON_COLORS.length];
}

/** The small color dot used next to a name. */
export function PersonDot({ color }: { color: string }) {
  return <span className="dot" style={{ background: color }} aria-hidden="true" />;
}

/** Dot + name, as the landing page's chat replies render a speaker. */
export function Person({ name, color }: { name: string; color: string }) {
  return (
    <span className="person">
      <PersonDot color={color} />
      {name}
    </span>
  );
}
