// frontend/src/components/MethodCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface MethodCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to?: string; // 👈 rota opcional
}

export function MethodCard({ title, description, icon: Icon, to }: MethodCardProps) {
  const Inner = (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );

  // Se tiver rota, embrulha no Link; senão, só renderiza o card
  return to ? (
    <Link to={to} className="block cursor-pointer">{Inner}</Link>
  ) : (
    Inner
  );
}
