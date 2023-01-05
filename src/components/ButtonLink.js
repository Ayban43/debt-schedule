
import { Link } from 'react-router-dom';
function ButtonLink() {
  return (
    <div className="addDebtButtonWrapper">
      <Link to="/create-debt">
        <button className="addDebt">Add Debt</button>
      </Link>
    </div>
  );
}

export default ButtonLink