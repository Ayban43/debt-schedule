import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import supabase from "../config/supabaseClient";

const ViewDebt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createdAt, setCreatedAt] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [beginningBalance, setBeginningBalance] = useState("");
  const [interest, setInterest] = useState("");
  const [debtsTable, setDebtsTable] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");

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
        //console.log(data)
      }
    };
    fetchDebt();
  }, [id, navigate]);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const ir = interest / 100 / 12;
  const obj = [];

  function getInterest(bal) {
    const a = bal * ir;
    return a;
  }

  function getPrincipal(a, b) {
    const c = a - b;
    return c;
  }

  function getEndingBalance(a, b) {
    const c = a - b;
    return c;
  }

  function getFirstDayOfNextMonth(adden) {
    const date = new Date(createdAt);
    
  
    return new Date(date.getFullYear(), date.getMonth() + adden, 1);
  }
  

  if (monthlyPayment == null) {
    /* get difference two dates */
    const date1 = new Date(createdAt);
    const date2 = new Date(maturityDate);
    const time = Math.abs(date1 - date2);
    const days = Math.ceil(time / (1000 * 60 * 60 * 24));
    const months = days / 30;
    const maturity_months = Math.round(months);

    function PMT(ir, np, pv, fv, type) {
      /*
       * ir   - interest rate per month
       * np   - number of periods (months)
       * pv   - present value
       * fv   - future value
       * type - when the payments are due:
       *        0: end of the period, e.g. end of month (default)
       *        1: beginning of period
       */
      var pmt, pvif;

      fv || (fv = 0);
      type || (type = 0);

      if (ir === 0) return -(pv + fv) / np;

      pvif = Math.pow(1 + ir, np);
      pmt = (-ir * (pv * pvif + fv)) / (pvif - 1);

      if (type === 1) pmt /= 1 + ir;

      return pmt;
    }

    /* MATURITY DATE GIVEN */

    const np = maturity_months;
    const pv = beginningBalance;
    const td_monthly_payment = PMT(ir, np, pv, 0, 0).toFixed(2) * -1;
    const td_interest = pv * ir;
    const td_principal = td_monthly_payment - td_interest;
    const td_ending_balance = pv - td_principal;
    const td_cumulative_interest = td_interest;

    

    for (let i = 0; i < np; i++) {
      if (i == 0) {
        obj[i] = {
          obj_begining_balance: pv,
          obj_monthly_payment: td_monthly_payment,
          obj_interest: td_interest,
          obj_principal: td_principal,
          obj_ending_balance: td_ending_balance,
          obj_cumulative_interest: td_interest,
          obj_payment_date: getFirstDayOfNextMonth(i + 1).toDateString()
        };
      } else {
        const newCurrentBalance = obj[i - 1].obj_ending_balance;
        const newInterest = getInterest(newCurrentBalance);

        if (newCurrentBalance < td_monthly_payment) {
            const newPrincipal = newCurrentBalance;
            const newInterest = getInterest(newCurrentBalance);
            const newMonthlyPayment = newPrincipal + newInterest;
            const newCumulativeInterest =
              obj[i - 1].obj_cumulative_interest + newInterest;
            obj[i] = {
              obj_begining_balance: newCurrentBalance,
              obj_monthly_payment: newMonthlyPayment,
              obj_interest: newInterest,
              obj_principal: newPrincipal,
              obj_ending_balance: getEndingBalance(
                newCurrentBalance,
                newPrincipal
              ),
              obj_cumulative_interest: newCumulativeInterest,
              obj_payment_date: getFirstDayOfNextMonth(i + 1).toDateString()
            };

        } else {
          const newPrincipal = getPrincipal(td_monthly_payment, newInterest);
          const newCumulativeInterest =
            obj[i - 1].obj_cumulative_interest + newInterest;
          obj[i] = {
            obj_begining_balance: newCurrentBalance,
            obj_monthly_payment: td_monthly_payment,
            obj_interest: newInterest,
            obj_principal: newPrincipal,
            obj_ending_balance: getEndingBalance(
              newCurrentBalance,
              newPrincipal
            ),
            obj_cumulative_interest: newCumulativeInterest,
            obj_payment_date: getFirstDayOfNextMonth(i + 1).toDateString()
          };
        }
      }
    }
  } else {
    const mp_interest = getInterest(beginningBalance);
    const mp_principal = getPrincipal(monthlyPayment, mp_interest);
    const mp_ending_balance = getEndingBalance(beginningBalance, mp_principal);

    let ctr = 0;
    let latestEndingBalance = 1;
    while (latestEndingBalance > 0) {
      if (ctr == 0) {
        obj[ctr] = {
          obj_begining_balance: beginningBalance,
          obj_monthly_payment: monthlyPayment,
          obj_interest: mp_interest,
          obj_principal: mp_principal,
          obj_ending_balance: mp_ending_balance,
          obj_cumulative_interest: mp_interest,
          obj_payment_date: getFirstDayOfNextMonth(ctr + 1).toDateString()
        };
      } else {
        const newCurrentBalance = obj[ctr - 1].obj_ending_balance;
        const newInterest = getInterest(newCurrentBalance);

        if (newCurrentBalance < monthlyPayment) {
          const newPrincipal = newCurrentBalance;
          const newInterest = getInterest(newCurrentBalance);
          const newMonthlyPayment = newPrincipal + newInterest;
          const newCumulativeInterest =
            obj[ctr - 1].obj_cumulative_interest + newInterest;
          obj[ctr] = {
            obj_begining_balance: newCurrentBalance,
            obj_monthly_payment: newMonthlyPayment,
            obj_interest: newInterest,
            obj_principal: newPrincipal,
            obj_ending_balance: getEndingBalance(
              newCurrentBalance,
              newPrincipal
            ),
            obj_cumulative_interest: newCumulativeInterest,
            obj_payment_date: getFirstDayOfNextMonth(ctr + 1).toDateString()
          };
          latestEndingBalance = getEndingBalance(
            newCurrentBalance,
            newPrincipal
          );
        } else {
          const newPrincipal = getPrincipal(monthlyPayment, newInterest);
          const newCumulativeInterest =
            obj[ctr - 1].obj_cumulative_interest + newInterest;

          obj[ctr] = {
            obj_begining_balance: newCurrentBalance,
            obj_monthly_payment: monthlyPayment,
            obj_interest: newInterest,
            obj_principal: newPrincipal,
            obj_ending_balance: getEndingBalance(
              newCurrentBalance,
              newPrincipal
            ),
            obj_cumulative_interest: newCumulativeInterest,
            obj_payment_date: getFirstDayOfNextMonth(ctr + 1).toDateString()
          };
          latestEndingBalance = getEndingBalance(
            newCurrentBalance,
            newPrincipal
          );
        }
      }

      ctr++;
    }

    console.log(obj);
  }

  return (
    <div className="page viewDebt">
      <div className="tableWrapper">
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
            {obj.length < 1 ? (
              <tr>
                <td colSpan={7}>NO Data yet!</td>
              </tr>
            ) : (
              obj.map((info, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{info.obj_payment_date}</td>
                    <td>{numberFormat(info.obj_begining_balance)}</td>
                    <td>{numberFormat(info.obj_monthly_payment)}</td>
                    <td>{numberFormat(info.obj_principal)}</td>
                    <td>{numberFormat(info.obj_interest)}</td>
                    <td>{numberFormat(info.obj_ending_balance)}</td>
                    <td>{numberFormat(info.obj_cumulative_interest)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

//console.log(obj)

/* MONTHLY PAYMENT GIVEN */

/* 
    monthlyPayment
    beginningBalance
    ir
  */

export default ViewDebt;
