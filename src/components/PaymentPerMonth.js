import React from 'react'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// currency formatter
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

const PaymentPerMonth = (props) => {
    const { object } = props;
    
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
                    <Area
                        type="monotone"
                        dataKey="payment"
                        stroke="#07143F"
                        fill="#07143F"
                        fillOpacity={0}
                    />
                    <Area
                        type="monotone"
                        dataKey="interest"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={.7}

                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default PaymentPerMonth