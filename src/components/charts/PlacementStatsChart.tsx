import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlacementStatsChartProps {
    data: {
        name: string;
        placed: number;
        pending: number;
    }[];
}

const PlacementStatsChart: React.FC<PlacementStatsChartProps> = ({ data }) => {
    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-[#0F2137] mb-4">Placement Statistics</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="placed" name="Placed" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="pending" name="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PlacementStatsChart;
