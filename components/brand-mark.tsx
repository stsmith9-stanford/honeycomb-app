/** The Honeycomb hex, as used in the landing page topbar. */
export function BrandMark({
  width = 26,
  height = 28,
  strokeWidth = 1.5,
}: {
  width?: number;
  height?: number;
  strokeWidth?: number;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 26 28" aria-hidden="true">
      <polygon
        points="13,1 24.5,7.5 24.5,20.5 13,27 1.5,20.5 1.5,7.5"
        fill="#d2912f"
        stroke="#b8761a"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
