const SURROUNDS = {
  cover: ["flower-cluster"],
  desktop: ["botanical-corner", "flower-cluster"],
  hero: ["flower-cluster"],
  story: ["flower-cluster"],
  closing: ["ivory-bow", "flower-cluster"],
} as const;

export function KeepsakeSurrounds({
  variant,
}: {
  variant: keyof typeof SURROUNDS;
}) {
  return (
    <div
      className={`pk-surrounds pk-surrounds--${variant}`}
      aria-hidden="true"
      data-pk-motion-zone
    >
      {SURROUNDS[variant].map((name, index) => {
        const isCutePressedCorner = name === "botanical-corner";
        const isCutePressedCluster = name === "flower-cluster";
        const isCuteSilkBow = name === "ivory-bow";
        const src = isCutePressedCorner
          ? "/images/paper-keepsake/real-pressed-corner-cute.png"
          : isCutePressedCluster
            ? "/images/paper-keepsake/real-pressed-cluster-cute.png"
            : isCuteSilkBow
              ? "/images/paper-keepsake/real-cute-silk-bow.png"
              : `/images/paper-keepsake/${name}.svg`;

        return (
          <span
            key={name}
            className={`pk-surround-piece pk-surround-piece--${index + 1}`}
          >
            <img
              className="pk-ornament"
              src={src}
              alt=""
              width="220"
              height="220"
              loading={
                variant === "cover" || variant === "desktop" ? "eager" : "lazy"
              }
              decoding="async"
            />
          </span>
        );
      })}
    </div>
  );
}
