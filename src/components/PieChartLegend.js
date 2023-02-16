import React from 'react'

const PieChartLegend = props => {
    const { object } = props;
    const data = object;

    const [{ name: Interest, value: interestValue },
        { name: Principal, value: principalValue }] = data

    const numberFormat = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);

    
    return (
        <div className="">
            <div className="flex items-center mb-3 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffc658" className="w-6 h-6">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                <span className="pr-5 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Total Interest: <span className="text-base font-semibold">{numberFormat(interestValue)}</span>
                </span>
            </div>
            <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00C49F" className="w-6 h-6">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                <span className="pr-5 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Total Principal: <span className="text-base font-semibold">{numberFormat(principalValue)}</span>
                </span>
            </div>
        </div>
    )
}

export default PieChartLegend