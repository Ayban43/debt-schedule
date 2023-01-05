import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'
import '../components/Table.css';
import ButtonLink from '../components/ButtonLink';


const Debt = () => {
    const [debts, setDebts] = useState([]);

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);

    useEffect(() => {
        getDebts();
    }, [])

    async function getDebts() {
        try {
            const { data, error } = await supabase
                .from("debts")
                .select("*")
            if (error) throw error;
            if (data != null) {
                setDebts(data); // [product1,product2,product3]
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // <table border={1} width="30%" cellPadding={10}>
    //     <tbody>
    //         <tr>
    //             <td>ID</td>
    //             <td>DESC</td>
    //         </tr>

    //         {debts.map{
    //             (info, ind) => {
    //                 return (
    //                     <tr key={ind}>
    //                         <td>haha{info.id}</td>
    //                         <td>{info.description}</td>
    //                     </tr>
    //                 )
    //             }
    //         }
    //         }
    //     </tbody>
    // </table>
    return (
        <div className="debt_body">

            <ButtonLink />
            <div className="tableWrapper">
                <table border={1} cellPadding={7}>
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

