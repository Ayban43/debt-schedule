import QuarterlyInterest from "../outputs/QuarterlyInterest";
import Computation from "../outputs/Computation";
import MonthlyInterest from "../outputs/MonthlyInterest";
import MaturityDate from "../outputs/MaturityDate";
import BudgetedPayment from "../outputs/BudgetedPayment";

const ViewDebt = () => {
  return(
    <div className = "viewDebt">
      {/* <MonthlyInterest /> */}
      {/* <QuarterlyInterest /> */}
    <MaturityDate />
    {/* <BudgetedPayment /> */}
    </div>
  )
}
  

export default ViewDebt;
