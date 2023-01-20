import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import supabase from "../config/supabaseClient";

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
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchDebt = async () => {
      const { data, error } = await supabase
        .from("debts")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/debt-schedule/", { replace: true });
        console.log(error);
      }
      if (data) {
        setCreatedAt(data.created_at);
        setMaturityDate(data.maturity_date);
        setBeginningBalance(data.beginning_balance);
        setInterest(data.interest);
        setMonthlyPayment(data.budgeted_payment);
        setPaymentFrequency(data.payment_frequency);
        setInterestFrequncy(data.interest_frequency);
        setDescription(data.description);
        // console.log(data)
      }
    };
    fetchDebt();
  }, [id, navigate]);

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
          
          if(i === 0){
            var currentBalance = loanAmount
            var paymentDate = getFirstDayOfNextMonth(startDate,i + 1)
          }else{
            var currentBalance = schedule[i - 1].remainingBalance
            var paymentDate = getFirstDayOfNextMonth(startDate,i + 1)
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

    //console.log(schedule)

    return (
      <div className="page viewDebt">
        <div className="tableWrapper">
          <div className="description">
            <h4>{description}</h4>
          </div>
          <table id="viewDebtTable" border={1} cellPadding={7}>
            <tbody>
              <tr>
                <th>#</th>
                <th>Payment Date</th>
                <th>Beginning Balance</th>
                <th>Monthly Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Ending Balance</th>
                <th>Cumulative Interest</th>
              </tr>
              {schedule.length < 1 ? (
                <tr>
                  <td colSpan={7}>NO Data yet!</td>
                </tr>
              ) : (
                schedule.map((info, ind) => {
                  return (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>{info.paymentDate}</td>
                      <td>{numberFormat(info.currentBalance)}</td>
                      <td>{numberFormat(info.payment)}</td>
                      <td>{numberFormat(info.principal)}</td>
                      <td>{numberFormat(info.interest)}</td>
                      <td>{numberFormat(info.remainingBalance)}</td>
                      <td>{numberFormat(info.cumulativeInterest)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
            paymentDate: getFirstDayOfNextMonth(startDate,i + 1),
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
            paymentDate: getFirstDayOfNextMonth(startDate,i + 1),
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

    return (
      <div className="page viewDebt">
        <div className="tableWrapper">
          <div className="description">
            <h4>{description}</h4>
          </div>
          <table id="viewDebtTable" border={1} cellPadding={7}>
            <tbody>
              <tr>
                <th>#</th>
                <th>Payment Date</th>
                <th>Beginning Balance</th>
                <th>Monthly Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Ending Balance</th>
                <th>Cumulative Interest</th>
              </tr>
              {schedule.length < 1 ? (
                <tr>
                  <td colSpan={7}>NO Data yet!</td>
                </tr>
              ) : (
                schedule.map((info, ind) => {
                  return (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>{info.paymentDate}</td>
                      <td>{numberFormat(info.currentBalance)}</td>
                      <td>{numberFormat(info.payment)}</td>
                      <td>{numberFormat(info.principal)}</td>
                      <td>{numberFormat(info.interest)}</td>
                      <td>{numberFormat(info.remainingBalance)}</td>
                      <td>{numberFormat(info.cumulativeInterest)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default AmortizationSchedule;
