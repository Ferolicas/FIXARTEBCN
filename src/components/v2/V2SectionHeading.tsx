import { Reveal } from "@/components/site/Reveal";

export function V2SectionHeading({
  kicker,
  title,
  text,
  center = false,
  as: Tag = "h2",
}: {
  kicker?: string;
  title: string;
  text?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={`fa-section-heading ${center ? "fa-section-heading-center" : ""}`}>
      {kicker && (
        <p className="fa-eyebrow">
          <span />
          {kicker}
        </p>
      )}
      <Tag className={Tag === "h1" ? "fa-page-title" : ""}>{title}</Tag>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
