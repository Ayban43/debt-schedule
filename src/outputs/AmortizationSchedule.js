import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import LoadingSpinner from "../components/LoadingSpinner";
import { SupabaseContext } from "..";
import React, { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import ExportExcel from "../components/ExportExcel";

const AmortizationSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createdAt, setCreatedAt] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [beginningBalance, setBeginningBalance] = useState("");
  const [interest, setInterest] = useState("");
  const [debtsTable, setDebtsTable] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("");
  const [interestFrequency, setInterestFrequncy] = useState("");
  const [title, setDescription] = useState("");
  const [state, setState] = useState({ status: 'loading' });
  const [category, setCategory] = useState("");


  const domEl = useRef(null);

  const downloadImage = async () => {

    const filter = (node: HTMLElement) => {
      const exclusionClasses = ['remove-me', 'secret-div'];
      return !exclusionClasses.some((classname) => node.classList?.contains(classname));
    }

    const dataUrl = await htmlToImage.toPng(domEl.current, { quality: 1, filter: filter });

    // download image
    const link = document.createElement('a');
    link.download = category + '(' + title + ')' + '.png';
    link.href = dataUrl;
    link.click();
  };


  useEffect(() => {
    const fetchDebt = async () => {
      const { data, error } = await supabase
        .from("debts")
        .select()
        .eq("id", id)
        .single();
      setState({ status: 'loaded' });
      if (error) {
        navigate("/", { replace: true });
        console.log(error);
      }
      if (data) {
        setCreatedAt(data.created_at);
        setMaturityDate(data.maturity_date);
        setBeginningBalance(data.current_balance);
        setInterest(data.interest);
        setMonthlyPayment(data.budgeted_payment);
        setPaymentFrequency(data.payment_frequency);
        setInterestFrequncy(data.interest_frequency);
        setDescription(data.title);
        setCategory(data.category);
        // console.log(data)
      }
    };
    fetchDebt();
  }, [id, navigate]);

  console.log(state.status)
  const numberFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  function getNoOfMonths() {
    const date1 = new Date(createdAt);
    const date2 = new Date(maturityDate);
    const time = Math.abs(date1 - date2);
    const days = Math.ceil(time / (1000 * 60 * 60 * 24));
    const months = days / 30;
    const maturity_months = Math.round(months);
    return maturity_months;
  }

  // function getFirstDayOfNextMonth(adden) {
  //   const date = new Date(createdAt);
  //   var d = new Date(date.getFullYear(), date.getMonth() + adden, 1);

  //   var datestring =
  //     ("0" + (d.getMonth() + 1)).slice(-2) +
  //     "/" +
  //     ("0" + d.getDate()).slice(-2) +
  //     "/" +
  //     d.getFullYear();

  //   return datestring;
  // }

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

  /* MATURITY DATE */

  if (maturityDate !== null) {
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
        periodLabel = "paymentCount";
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
        periodLabel = "paymentCount";
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
        periodLabel = "paymentCount";
      } else if (
        interestFrequency === "Quarterly" &&
        paymentFrequency === "Quarterly"
      ) {
        interestRate = annualInterestRate / 4;
        payment =
          loanAmount *
          (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
        period = numPayments / 3;
        periodLabel = "paymentCount";
      } else if (
        interestFrequency === "Monthly" &&
        paymentFrequency === "Monthly"
      ) {
        interestRate = annualInterestRate / 12;
        payment =
          loanAmount *
          (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
        period = numPayments;
        periodLabel = "paymentCount";
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
        periodLabel = "paymentCount";
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
      createdAt
    );

    if (state.status === 'loading') {
      return <LoadingSpinner />
    }

    const wscols = [
      { wch: 5 },
      { wch: 13 },
      { wch: 13 },
      { wch: 14 },
      { wch: 10 },
      { wch: 10 },
      { wch: 13 },
      { wch: 16 },

    ];

    return (

      <div className="grid p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 min-w-4xl">
        <div className="page viewDebt m-w-7xl">
            <div id="domEl" ref={domEl} className="tableWrapper shadow-md sm:rounded-lg">
              <div className=" bg-slate-100 flex justify-between items-center">
                <div className=" p-5 text-lg font-semibold text-left text-gray-900 dark:text-white dark:bg-gray-800">
                  {title}
                  <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">{category}</p>
                </div>
                <div className="flex p-2 gap-1 secret-div">
                  <svg className="hover:cursor-pointer hover:w-[42px] hover:h-[42px]" onClick={downloadImage} width="40px" height="40px" viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00064"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fillRule="evenodd" clipRule="evenodd"> <path d="M5.125.042c-2.801 0-5.072 2.273-5.072 5.074v53.841c0 2.803 2.271 5.073 5.072 5.073h45.775c2.801 0 5.074-2.271 5.074-5.073v-38.604l-18.904-20.311h-31.945z" fill="#49C9A7"></path> <path d="M55.977 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z" fill="#37BB91"></path> <path d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z" opacity=".5" fill="#ffffff"></path> </g> <path d="M10.119 53.739v-20.904h20.906v20.904h-20.906zm18.799-18.843h-16.691v12.6h16.691v-12.6zm-9.583 8.384l3.909-5.256 1.207 2.123 1.395-.434.984 5.631h-13.082l3.496-3.32 2.091 1.256zm-3.856-3.64c-.91 0-1.649-.688-1.649-1.538 0-.849.739-1.538 1.649-1.538.912 0 1.65.689 1.65 1.538 0 .85-.738 1.538-1.65 1.538z" fillRule="evenodd" clipRule="evenodd" fill="#ffffff"></path> </g></svg>
                  <ExportExcel
                    csvData={schedule}
                    fileName={title + "(" + category + ")"}
                    wscols={wscols}
                  />
                </div>
              </div>
              <table className="debts w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">Payment Date</th>
                    <th scope="col" className="px-6 py-3">Current Balance</th>
                    <th scope="col" className="px-6 py-3">Monthly Payment</th>
                    <th scope="col" className="px-6 py-3">Principal</th>
                    <th scope="col" className="px-6 py-3">Interest</th>
                    <th scope="col" className="px-6 py-3">Ending Balance</th>
                    <th scope="col" className="px-6 py-3">Cumulative Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.length < 1 ? (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td colSpan={7}>NO Data yet!</td>
                    </tr>
                  ) : (
                    schedule.map((info, ind) => {
                      return (
                        <tr className="odd:bg-white even:bg-slate-50 border-b dark:bg-gray-800 dark:border-gray-700" key={ind}>
                          <td className="px-6 py-4">{ind + 1}</td>
                          <td className="px-6 py-4">{info.paymentDate}</td>
                          <td className="px-6 py-4">{numberFormat(info.currentBalance)}</td>
                          <td className="px-6 py-4">{numberFormat(info.payment)}</td>
                          <td className="px-6 py-4">{numberFormat(info.principal)}</td>
                          <td className="px-6 py-4">{numberFormat(info.interest)}</td>
                          <td className="px-6 py-4">{numberFormat(info.remainingBalance)}</td>
                          <td className="px-6 py-4">{numberFormat(info.cumulativeInterest)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    );
  } else {
    /* BUDGETED MONTHLY PAYMENT */
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
      var startDate = createdAt

      if (interestFrequency === "Monthly" && paymentFrequency === "Monthly") {
        interestRate = annualInterestRate / 12;
        periodLabel = "paymentCount";
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
        periodLabel = "paymentCount";
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
        periodLabel = "paymentCount";
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
      return schedule;
    }

    let schedule = amortizationSchedule(
      beginningBalance,
      interest / 100,
      monthlyPayment,
      interestFrequency,
      paymentFrequency,
      createdAt
    );

    if (state.status === 'loading') {
      return <LoadingSpinner />
    }

    const wscols = [
      { wch: 5 },
      { wch: 13 },
      { wch: 13 },
      { wch: 14 },
      { wch: 10 },
      { wch: 10 },
      { wch: 13 },
      { wch: 16 },

    ];

    // { wch: Math.max(...schedule.map(schedule => schedule.currentBalance.length)) },
    // { wch: Math.max(...schedule.map(schedule => schedule.payment.length)) },
    // { wch: Math.max(...schedule.map(schedule => schedule.principal.length)) },
    // { wch: Math.max(...schedule.map(schedule => schedule.interest.length)) },
    // { wch: Math.max(...schedule.map(schedule => schedule.remainingBalance.length)) },
    // { wch: Math.max(...schedule.map(schedule => schedule.cumulativeInterest.length)) },
    // console.log(schedule)
    return (
        <div className="grid p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 min-w-4xl">
          <div className="page viewDebt m-w-7xl">
            <div id="domEl" ref={domEl} className="tableWrapper shadow-md sm:rounded-lg">
              <div className=" bg-slate-50 flex justify-between items-center">
                <div className=" p-5 text-lg font-semibold text-left text-gray-900 dark:text-white dark:bg-gray-800">
                  {title}
                  <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">{category}</p>
                </div>
                <div className="flex p-2 gap-1 secret-div">
                  <svg className="hover:cursor-pointer hover:w-[42px] hover:h-[42px]" onClick={downloadImage} width="40px" height="40px" viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00064"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fillRule="evenodd" clipRule="evenodd"> <path d="M5.125.042c-2.801 0-5.072 2.273-5.072 5.074v53.841c0 2.803 2.271 5.073 5.072 5.073h45.775c2.801 0 5.074-2.271 5.074-5.073v-38.604l-18.904-20.311h-31.945z" fill="#49C9A7"></path> <path d="M55.977 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z" fill="#37BB91"></path> <path d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z" opacity=".5" fill="#ffffff"></path> </g> <path d="M10.119 53.739v-20.904h20.906v20.904h-20.906zm18.799-18.843h-16.691v12.6h16.691v-12.6zm-9.583 8.384l3.909-5.256 1.207 2.123 1.395-.434.984 5.631h-13.082l3.496-3.32 2.091 1.256zm-3.856-3.64c-.91 0-1.649-.688-1.649-1.538 0-.849.739-1.538 1.649-1.538.912 0 1.65.689 1.65 1.538 0 .85-.738 1.538-1.65 1.538z" fillRule="evenodd" clipRule="evenodd" fill="#ffffff"></path> </g></svg>
                  <ExportExcel
                    csvData={schedule}
                    fileName={title + "(" + category + ")"}
                    wscols={wscols}
                    exportFor={"amortizationSchedule"}
                  />
                </div>
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">Payment Date</th>
                    <th scope="col" className="px-6 py-3">Current Balance</th>
                    <th scope="col" className="px-6 py-3">Monthly Payment</th>
                    <th scope="col" className="px-6 py-3">Principal</th>
                    <th scope="col" className="px-6 py-3">Interest</th>
                    <th scope="col" className="px-6 py-3">Ending Balance</th>
                    <th scope="col" className="px-6 py-3">Cumulative Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.length < 1 ? (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td colSpan={7}>No Data yet!</td>
                    </tr>
                  ) : (
                    schedule.map((info, ind) => {
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={ind}>
                          <td className="px-6 py-4">{ind + 1}</td>
                          <td className="px-6 py-4">{info.paymentDate}</td>
                          <td className="px-6 py-4">{numberFormat(info.currentBalance)}</td>
                          <td className="px-6 py-4">{numberFormat(info.payment)}</td>
                          <td className="px-6 py-4">{numberFormat(info.principal)}</td>
                          <td className="px-6 py-4">{numberFormat(info.interest)}</td>
                          <td className="px-6 py-4">{numberFormat(info.remainingBalance)}</td>
                          <td className="px-6 py-4">{numberFormat(info.cumulativeInterest)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
  }
};

export default AmortizationSchedule;
