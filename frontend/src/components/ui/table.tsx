import type { HTMLAttributes, PropsWithChildren } from "react";

export function Table(p: PropsWithChildren<HTMLAttributes<HTMLTableElement>>) { return <table {...p} />; }
export function TableHeader(p: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) { return <thead {...p} />; }
export function TableBody(p: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) { return <tbody {...p} />; }
export function TableRow(p: PropsWithChildren<HTMLAttributes<HTMLTableRowElement>>) { return <tr {...p} />; }
export function TableHead({ className = "", ...p }: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) { return <th className={("px-3 py-2 text-left font-medium " + className).trim()} {...p} />; }
export function TableCell({ className = "", ...p }: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) { return <td className={("px-3 py-2 " + className).trim()} {...p} />; }
