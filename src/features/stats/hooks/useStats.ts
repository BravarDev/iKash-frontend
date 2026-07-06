import { useState } from "react";
import { Stats } from "../models/stats";

export function useStats() {
    const [stats, setStats] = useState<Stats | null>(null);

    const getStats = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`);
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    return { stats, getStats };
}