import type { LucideProps } from "lucide-react";
import * as Icons from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
  fallback?: string;
}

export function DynamicIcon({ name, fallback = "map", ...props }: DynamicIconProps) {
  // Converte kebab-case para PascalCase: "alert-triangle" → "AlertTriangle"
  const toPascal = (s: string) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");

  const iconName = toPascal(name);
  const Icon = (Icons as Record<string, unknown>)[iconName] as React.FC<LucideProps> | undefined;
  const Fallback = (Icons as Record<string, unknown>)[toPascal(fallback)] as React.FC<LucideProps>;

  return Icon ? <Icon {...props} /> : <Fallback {...props} />;
}
