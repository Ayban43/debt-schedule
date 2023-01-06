import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'
import '../components/Table.css'
import ButtonLink from '../components/ButtonLink'
import { Link } from 'react-router-dom'
import { VscTable } from "react-icons/vsc";


const Debt = () => {
    const [debts, setDebts] = useState([]);
    const [fetchError,setFetchError] = useState(null)

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);

    useEffect(() =>{
        const fetchDebts = async () => {
            const {data,error} = await supabase
            .from('debts')
            .select()

            if(error){
                setFetchError('Could not fetch data')
                setDebts(null)
                console.log(error)
            }
            if (data) {
                setDebts(data);
                setFetchError(null)
            }
        }
        fetchDebts()
    }, [])

    return (
        <div className="debt_body">

            <ButtonLink />
            <div className="tableWrapper">
                <table className="debts" border={1} cellPadding={7}>
                    <tbody>
                        <tr>
                            <th>Counter</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Beginning Balance</th>
                            <th>Interest</th>
                            <th>Interest Frequency</th>
                            <th>Maturity Date</th>
                            <th>Budgeted Monthly Payment</th>
                            <th>Payment Frequency</th>
                            <th>Min. Monthly Payment</th>
                            <th>View</th>
                        </tr>
                        {debts.length < 1 ?
                            <tr>
                                <td colSpan={10}>NO Data yet!</td>
                            </tr> :
                            debts.map((info, ind) => {
                                return (
                                    <tr key={ind}>
                                        <td>{ind + 1}</td>
                                        <td>{info.category}</td>
                                        <td>{info.description}</td>
                                        <td>{numberFormat(info.beginning_balance)}</td>
                                        <td>{info.interest}%</td>
                                        <td>{info.interest_frequency}</td>
                                        <td>{info.maturity_date}</td>
                                        <td>{numberFormat(info.budgeted_payment)}</td>
                                        <td>{info.payment_frequency}</td>
                                        <td>{numberFormat(info.minimum_payment)}</td>
<<<<<<< HEAD
                                        <td>
                                            <Link to={"/debt-schedule/" + info.id}>
                                                <VscTable />
                                            </Link>
                                        </td>
=======
>>>>>>> 34cbea1e765025d9d1cbb7a64fc643800247879a
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>

        </div>
    );


}

export default Debt

