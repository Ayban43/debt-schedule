
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#ffc658', '#00C49F'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


const PieChartInterestPrincipal = (props) => {
    const { object } = props;
    const data = object;

    const [{ name: Interest, value: interestValue },
        { name: Principal, value: principalValue }] = data


    return (
        <div>
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Debt Breakdown</h5>
            <div style={{ width: "100%", height: 295 }}>

                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            labelLine={false}
                            cx="50%"
                            cy="50%"
                            label={renderCustomizedLabel}
                            fill="#8884d8"
                        dataKey="value"
                        fillOpacity={.8}
                        >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

        </div>
        </div >

    );
}


export default PieChartInterestPrincipal