import { useState } from "react";
import { Stats } from "../models/stats";

export type TimeWindow = "7d" | "2s" | "1m" | "all";

export function useStats() {
    const [stats, setStats] = useState<Stats | null>(null);

    const getStats = async (timeWindow?: string) => {
        try {
            const params = timeWindow && timeWindow !== "7d" ? `?window=${timeWindow}` : "";
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats${params}`);
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    return { stats, getStats };
}