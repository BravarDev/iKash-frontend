import { WaitListTimeLine } from "../models/timeLine";
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

type WaitlistGrowthProps = {
    timeLine: WaitListTimeLine[];
}

export function WaitlistGrowth({ timeLine }: WaitlistGrowthProps) {
    return (
        <div>
            <ResponsiveContainer width="95%" height={300}>
                <AreaChart data={timeLine} margin={{ top: 50, right: 30, left: 30, bottom: 0 }}>
                    <defs>
                        <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a3e635" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        vertical={true}
                        horizontal={false}
                        stroke="#ffffff"
                        strokeOpacity={0.06}
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                        interval={0}
                    />

                    <Tooltip
                        contentStyle={{
                            background: "#111111",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "#9ca3af" }}
                        itemStyle={{ color: "#a3e635" }}
                    />

                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#a3e635"
                        strokeWidth={2}
                        fill="url(#lineGlow)"
                        dot={{ r: 4, fill: "#a3e635", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}