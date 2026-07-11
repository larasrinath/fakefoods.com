export function FoodArt({
  emoji,
  hue,
  className = "",
  emojiClassName = "text-4xl",
}: {
  emoji: string;
  hue: number;
  className?: string;
  emojiClassName?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center select-none ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 85% 92%), hsl(${(hue + 40) % 360} 75% 84%))`,
      }}
      aria-hidden
    >
      <span className={emojiClassName}>{emoji}</span>
    </div>
  );
}
