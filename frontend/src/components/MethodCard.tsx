import { Card, CardContent, CardHeader, CardTitle } from "./ui/cards.tsx";

import type { ComponentType } from "react";

interface MethodCardProps {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export function MethodCard({ title, description, icon: Icon }: MethodCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 bg-white">
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
}