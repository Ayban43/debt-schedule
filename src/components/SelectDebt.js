import React, { useState, useEffect, useContext, useRef } from 'react';
import { MultiSelect } from "react-multi-select-component";
import supabase from "../config/supabaseClient";
import PaymentPerMonth from './PaymentPerMonth';
import { SupabaseContext } from '..';
import ".."
import "./SelectDebt.css"
import ThisMonthsPayment from './ThisMonthsPayment';
import PieChartInterestPrincipal from './PieChartInterestPrincipal';
import ProgressBar from './ProgressBar';
import NextMonthsPayment from './NextMonthsPayment';
import PieChartLegend from './PieChartLegend';
import * as htmlToImage from 'html-to-image';


const SelectDebt = (props) => {

    const { object } = props;

    const queryResults = useContext(SupabaseContext)
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);

    const [datas, setDatas] = useState('');
    // const navigate = useNavigate();
    const [createdAt, setCreatedAt] = useState("");
    const [maturityDate, setMaturityDate] = useState("");
    const [beginningBalance, setBeginningBalance] = useState("");
    const [interest, setInterest] = useState("");
    const [monthlyPayment, setMonthlyPayment] = useState("");
    const [paymentFrequency, setPaymentFrequency] = useState("");
    const [interestFrequency, setInterestFrequncy] = useState("");
    const [title, setTitle] = useState("");

    const [amortizationData, setAmortizationData] = useState([]);

    const domEl = useRef(null);

    const downloadImage = async () => {

        const filter = (node: HTMLElement) => {
            const exclusionClasses = ['remove-me', 'secret-div'];
            return !exclusionClasses.some((classname) => node.classList?.contains(classname));
        }

        const dataUrl = await htmlToImage.toPng(domEl.current, { quality: 1, filter: filter });

        // download image
        const link = document.createElement('a');
        // link.download = category + '(' + title + ')' + '.png';
        link.download = 'Dashboard.png';
        link.href = dataUrl;
        link.click();
    };

    function getNoOfMonths(from, to) {
        const createdDate = from
        const maturityDate = to
        const date1 = new Date(createdDate);
        const date2 = new Date(maturityDate);
        const time = Math.abs(date1 - date2);
        const days = Math.ceil(time / (1000 * 60 * 60 * 24));
        const months = days / 30;
        const maturity_months = Math.round(months);
        return maturity_months;
    }

    function getFirstDayOfNextMonth(from, adden) {
        const date = new Date(from);
        var d = new Date(date.getFullYear(), date.getMonth() + adden, 1);

        var datestring =
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "/" +
            ("0" + d.getDate()).slice(-2) +
            "/" +
            d.getFullYear();

        return datestring;
    }

    function getFirstDayOfPlusThreeMonth(from) {
        const date = new Date(from);
        var d = new Date(date.getFullYear(), date.getMonth() + 3, 1);

        var datestring =
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "/" +
            ("0" + d.getDate()).slice(-2) +
            "/" +
            d.getFullYear();

        return datestring;
    }

    const handleChange = async (selected) => {
        //console.log(selected)
        setSelected(selected);
        var selectedId = selected.map(item => item.value)
        //console.log(selectedId)
        try {
            const res = await supabase
                .from('debts')
                .select('*')
                .in('id', selectedId)
            if (res.data) {
                setDatas(res.data)
                setCreatedAt(res.data.created_at);
                setMaturityDate(res.data.maturity_date);
                setBeginningBalance(res.data.current_balance);
                setInterest(res.data.interest);
                setMonthlyPayment(res.data.budgeted_payment);
                setPaymentFrequency(res.data.payment_frequency);
                setInterestFrequncy(res.data.interest_frequency);
                setTitle(res.data.title);

                let amortData = res.data.map(debt => {
                    if (debt.maturity_date !== null) {
                        function amortizationSchedule(
                            loanAmount,
                            annualInterestRate,
                            numPayments,
                            interestFrequency,
                            paymentFrequency,
                            createdAt
                        ) {
                            var interestRate;
                            var payment;
                            var remainingBalance = loanAmount;
                            var cumulativeInterest = 0;
                            var schedule = [];
                            var period;
                            var periodLabel;
                            var startDate = createdAt;

                            // calculate interest rate based on frequency
                            if (interestFrequency === "Annually" && paymentFrequency === "Monthly") {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 1;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
                                period = numPayments;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Annually" &&
                                paymentFrequency === "Quarterly"
                            ) {
                                let q = 4;
                                let r = annualInterestRate;
                                let m = 1;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 4;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
                                period = numPayments / 3;
                                periodLabel = "quarter";
                            } else if (
                                interestFrequency === "Quarterly" &&
                                paymentFrequency === "Monthly"
                            ) {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 4;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
                                period = numPayments;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Quarterly" &&
                                paymentFrequency === "Quarterly"
                            ) {
                                interestRate = annualInterestRate / 4;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
                                period = numPayments / 3;
                                periodLabel = "quarter";
                            } else if (
                                interestFrequency === "Monthly" &&
                                paymentFrequency === "Monthly"
                            ) {
                                interestRate = annualInterestRate / 12;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
                                period = numPayments;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Monthly" &&
                                paymentFrequency === "Quarterly"
                            ) {
                                let q = 4;
                                let r = annualInterestRate;
                                let m = 12;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = (qi / 12) * 3;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
                                period = numPayments / 3;
                                periodLabel = "quarter";
                            }
                            // else {
                            //     throw new Error("Invalid interest frequency. Please use 'Annually', 'Quarterly', or 'Monthly'");
                            // }
                            for (var i = 0; i < period; i++) {
                                var interest = remainingBalance * interestRate;
                                cumulativeInterest += interest;
                                var principal = payment - interest;
                                remainingBalance -= principal;
                                if (paymentFrequency === "Monthly") {
                                    if (i === 0) {
                                        var currentBalance = loanAmount
                                        var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
                                    } else {
                                        var currentBalance = schedule[i - 1].remainingBalance
                                        var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
                                    }
                                    schedule.push({
                                        [periodLabel]: i + 1,
                                        interest: interest,
                                        cumulativeInterest: cumulativeInterest,
                                        principal: principal,
                                        remainingBalance: remainingBalance,
                                        payment: payment,
                                        currentBalance: currentBalance,
                                        paymentDate: paymentDate,
                                    });
                                } else {

                                    if (i === 0) {
                                        var currentBalance = loanAmount
                                        var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
                                    } else {
                                        var currentBalance = schedule[i - 1].remainingBalance
                                        var paymentDate = getFirstDayOfPlusThreeMonth(schedule[i - 1].paymentDate)
                                    }
                                    schedule.push({
                                        [periodLabel]: i + 1,
                                        interest: interest,
                                        cumulativeInterest: cumulativeInterest,
                                        principal: principal,
                                        remainingBalance: remainingBalance,
                                        payment: payment,
                                        currentBalance: currentBalance,
                                        paymentDate: paymentDate,
                                    });
                                }
                            }
                            return schedule;
                        }

                        let schedule = amortizationSchedule(
                            beginningBalance,
                            interest / 100,
                            getNoOfMonths(),
                            interestFrequency,
                            paymentFrequency,
                            createdAt,
                        );

                        return amortizationSchedule(debt.current_balance, debt.interest / 100, getNoOfMonths(debt.created_at, debt.maturity_date), debt.interest_frequency, debt.payment_frequency, debt.created_at);

                    }
                    /*  Budgeted Payment*/
                    else {
                        function amortizationSchedule(
                            loanAmount,
                            annualInterestRate,
                            monthlyPayment,
                            interestFrequency,
                            paymentFrequency,
                            createdAt
                        ) {
                            var interestRate;
                            var payment = monthlyPayment;
                            var remainingBalance = loanAmount;
                            var cumulativeInterest = 0;
                            var schedule = [];
                            var period;
                            var periodLabel;
                            var startDate = createdAt;

                            if (interestFrequency === "Monthly" && paymentFrequency === "Monthly") {
                                interestRate = annualInterestRate / 12;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Quarterly" &&
                                paymentFrequency === "Monthly"
                            ) {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 4;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Annually" &&
                                paymentFrequency === "Monthly"
                            ) {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 1;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                periodLabel = "month";
                            }

                            let latestEndingBalance = 1;
                            for (var i = 0; latestEndingBalance > 0; i++) {
                                var interest = remainingBalance * interestRate;
                                cumulativeInterest += interest;
                                var principal = payment - interest;
                                remainingBalance -= principal;
                                var currentBalance =
                                    i === 0 ? loanAmount : schedule[i - 1].remainingBalance;
                                var paymentDate;

                                if (paymentFrequency === "Monthly") {
                                    if (currentBalance < payment) {
                                        principal = currentBalance;
                                        interest = currentBalance * interestRate;
                                        payment = principal + interest;
                                        cumulativeInterest = schedule[i - 1].cumulativeInterest + interest;
                                        remainingBalance = 0;

                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;

                                    } else {
                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;
                                    }
                                } else {
                                    if (currentBalance < payment) {
                                        principal = currentBalance;
                                        interest = currentBalance * interestRate;
                                        payment = principal + interest;
                                        cumulativeInterest = schedule[i - 1].cumulativeInterest + interest;
                                        remainingBalance = 0;

                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;

                                    } else {
                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;
                                    }
                                }

                            }
                            return schedule;
                        }

                        let schedule = amortizationSchedule(
                            beginningBalance,
                            interest / 100,
                            monthlyPayment,
                            interestFrequency,
                            paymentFrequency
                        );

                        return amortizationSchedule(debt.current_balance, debt.interest / 100, debt.budgeted_payment, debt.interest_frequency, debt.payment_frequency, debt.created_at);

                    }
                });

                setAmortizationData(amortData);

            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await supabase.from('debts').select('*').eq('profile_id', queryResults.id)
                setOptions(res.data.map(item => {
                    return {
                        label: item.title,
                        value: item.id
                    }
                }));
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
    }, []);

    const sumByPaymentDate = Object.entries(amortizationData.reduce((acc, subArray) => {
        return subArray.reduce((innerAcc, curr) => {
            if (innerAcc[curr.paymentDate]) {
                innerAcc[curr.paymentDate].payment += curr.payment;
                innerAcc[curr.paymentDate].interest += curr.interest;
                innerAcc[curr.paymentDate].principal += curr.principal;
            } else {
                innerAcc[curr.paymentDate] = {
                    payment: curr.payment,
                    interest: curr.interest,
                    principal: curr.principal
                };
            }
            return innerAcc;
        }, acc);
    }, {}));

    const finalArray = sumByPaymentDate.map(([date, value]) => {
        return { ...value, date };
    });

    finalArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentDate = new Date();

    // Get the current month and year
    let currentMonth = currentDate.getMonth() + 1;
    let nextMonth = currentDate.getMonth() + 2;
    let currentYear = currentDate.getFullYear();
    let currentPayment;
    let nextPayment;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;


    for (let i = 0; i < finalArray.length; i++) {
        let paymentDate = new Date(finalArray[i].date);
        let paymentMonth = paymentDate.getMonth() + 1;
        let paymentNextMonth = paymentDate.getMonth() + 1;
        let paymentYear = paymentDate.getFullYear();

        if (currentMonth === paymentMonth && currentYear === paymentYear) {
            currentPayment = finalArray[i];

        }

        if (nextMonth === paymentNextMonth && currentYear === paymentYear) {
            if (i === finalArray.length) {
                nextPayment = { payment: 0, interest: 0, principal: 0, date: "paid" }
            } else {
                nextPayment = finalArray[i];
            }

        }

        if (paymentDate <= currentDate) {
            totalPaid += finalArray[i].payment;
        } else {
            totalUnpaid += finalArray[i].payment;
        }


        totalInterest += finalArray[i].interest;
        totalPrincipal += finalArray[i].principal;
    }

    let totalPayments = totalPaid + totalUnpaid;
    let percentPaid = (totalPaid / totalPayments) * 100;
    let percentUnpaid = (totalUnpaid / totalPayments) * 100;

    const thisMonthsPayment = currentPayment
    const nextMonthsPayment = nextPayment

    const totalInterestPrincipal = [{ "name": "Interest", "value": totalInterest }, { "name": "Principal", "value": totalPrincipal }]
    const totalPaidUnpaid = [{ "name": "Paid", "value": totalPaid }, { "name": "Unpaid", "value": totalUnpaid }, { "name": "PercentPaid", "value": percentPaid }, { "name": "PercentUnpaid", "value": percentUnpaid }]

    return (
        <div className="grid bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" id="domEl" ref={domEl}>

            <div className="w-full p-10">
                <div className="w-max pb-5">
                    <p className="text-2xl font-semibold">
                        {object ? (
                            <>
                                <span>{object}</span><span> Debt Dashboard</span>
                            </>

                        ) : (
                            <span>Your Debt Dashboard</span>
                        )}

                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <MultiSelect
                        options={options}
                        value={selected}
                        onChange={handleChange}
                        labelledBy="Select"
                    />
                    <div className="flex p-2 gap-1 secret-div">
                        <svg className="hover:cursor-pointer hover:w-[42px] hover:h-[42px]" onClick={downloadImage} width="40px" height="40px" viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00064"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fillRule="evenodd" clipRule="evenodd"> <path d="M5.125.042c-2.801 0-5.072 2.273-5.072 5.074v53.841c0 2.803 2.271 5.073 5.072 5.073h45.775c2.801 0 5.074-2.271 5.074-5.073v-38.604l-18.904-20.311h-31.945z" fill="#49C9A7"></path> <path d="M55.977 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z" fill="#37BB91"></path> <path d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z" opacity=".5" fill="#ffffff"></path> </g> <path d="M10.119 53.739v-20.904h20.906v20.904h-20.906zm18.799-18.843h-16.691v12.6h16.691v-12.6zm-9.583 8.384l3.909-5.256 1.207 2.123 1.395-.434.984 5.631h-13.082l3.496-3.32 2.091 1.256zm-3.856-3.64c-.91 0-1.649-.688-1.649-1.538 0-.849.739-1.538 1.649-1.538.912 0 1.65.689 1.65 1.538 0 .85-.738 1.538-1.65 1.538z" fillRule="evenodd" clipRule="evenodd" fill="#ffffff"></path> </g></svg>
                    </div>
                </div>

            </div>
            <hr></hr>

            <div className="grid grid-cols-1 lg:grid-cols-4 pr-10 pl-10 pb-5 gap-5 items-start ">

                <div className="flex flex-col gap-3 min-h-[200px]" >
                    <div className=" bg-white border border-gray-200 rounded-lg shadow p-2 lg:p-4 dark:bg-gray-800 dark:border-gray-700">
                        <ThisMonthsPayment object={thisMonthsPayment} />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow p-2 lg:p-4 dark:bg-gray-800 dark:border-gray-700">
                        <NextMonthsPayment object={nextMonthsPayment} />
                    </div>
                </div>

                <div className=" bg-white border border-gray-200 rounded-lg shadow lg:p-4 dark:bg-gray-800 dark:border-gray-700 min-h-[200px]">
                    <PieChartInterestPrincipal object={totalInterestPrincipal} />
                    <PieChartLegend object={totalInterestPrincipal} />
                </div>

                <div className="col-span-2 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700 min-h-[200px]">
                    <PaymentPerMonth object={finalArray} />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 min-h-[200px] mb-10 ml-10 mr-10">
                <ProgressBar object={totalPaidUnpaid} />
            </div>
        </div>


    );
};

export default SelectDebt;