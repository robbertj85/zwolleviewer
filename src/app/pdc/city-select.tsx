"use client";

import { useRouter } from "next/navigation";
import { getLiveCities } from "@/lib/cities";

/** City dropdown that navigates to /pdc?city=<slug> on change. */
export default function CitySelect({ value }: { value: string }) {
  const router = useRouter();
  const cities = getLiveCities();
  return (
    <select
      value={value}
      onChange={(e) => router.push(`/pdc?city=${e.target.value}`)}
      className="rounded-md border bg-background px-3 py-1.5 text-sm"
    >
      {cities.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
