
import { Link } from 'react-router-dom';
function ButtonLink() {
  return (
    <div className="addDebtButtonWrapper">
      <Link to="../debt-schedule/create-debt">
        <button className="addDebt">Add Debt</button>
      </Link>
    </div>
  );
}

export default ButtonLink
