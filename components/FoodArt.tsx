import Image from "next/image";

export function FoodArt({
  emoji,
  hue,
  imageSrc,
  imageAlt = "",
  imageFit = "cover",
  className = "",
  emojiClassName = "text-4xl",
}: {
  emoji: string;
  hue: number;
  imageSrc?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  className?: string;
  emojiClassName?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 85% 92%), hsl(${(hue + 40) % 360} 75% 84%))`,
      }}
      aria-hidden
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className={imageFit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        <span className={emojiClassName}>{emoji}</span>
      )}
    </div>
  );
}
