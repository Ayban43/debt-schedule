import React from 'react'

import { AreaChart, Legend, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// currency formatter
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

const PaymentPerMonth = (props) => {
    const { object } = props;
    console.log(object)

    return (
        <div className="" style={{ width: 400, height: 400, paddingRight: 100 }}>
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Graph Life of Debt</h5>
            <ResponsiveContainer >
                <AreaChart
                    data={object}
                    margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                        formatter={value => formatter.format(value).slice(0, 10)}
                    />
                    <Legend verticalAlign="bottom" height={36} />

                    <Area
                        type="monotone"
                        dataKey="payment"
                        stroke="#07143F"
                        strokeWidth={3}
                        fill="#07143F"
                        fillOpacity={.1}
                        // activeDot={{ stroke: '#white', strokeWidth: 1, r: 1, fill: '#ff5f4a'}} dot={{ stroke: '#44c0ff', strokeWidth: 1, r: 2, fill: 'blue', fillOpacity:.2}}
                    />
                    <Area
                        type="monotone"
                        dataKey="principal"
                        stroke="#00C49F"
                        strokeWidth={3}
                        fill="#00C49F"
                        fillOpacity={.5}
                    />
                    <Area
                        type="monotone"
                        dataKey="interest"
                        stroke="#ffc658"
                        strokeWidth={3}
                        fill="#ffc658"
                        fillOpacity={.5}
                        

                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default PaymentPerMonth