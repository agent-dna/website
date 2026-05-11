import logoWb from "../assets/wb.png";

type Props = {
  variant?: "blue" | "white";
  className?: string;
  height?: number;
};

export function Logo({ className, height = 36 }: Props) {
  return (
    <img
      src={logoWb}
      alt="AgentDNA"
      height={height}
      style={{ height, width: "auto", display: "block" }}
      draggable={false}
      className={className}
    />
  );
}
