import QuarterlyInterest from "../outputs/QuarterlyInterest";
import Computation from "../outputs/Computation";
import MonthlyInterest from "../outputs/MonthlyInterest";
import MaturityDate from "../outputs/AmortizationSchedule";
import BudgetedPayment from "../outputs/BudgetedPayment";
import AmortizationSchedule from "../outputs/AmortizationSchedule";

const ViewDebt = () => {
  return(
    <div className = "viewDebt">
      {/* <MonthlyInterest /> */}
      {/* <QuarterlyInterest /> */}
    <AmortizationSchedule />
    {/* <BudgetedPayment /> */}
    </div>
  )
}
  

export default ViewDebt;
