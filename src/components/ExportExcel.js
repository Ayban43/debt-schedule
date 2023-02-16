import React from 'react'
import FileSaver from "file-saver";
import * as XLSX from 'xlsx/xlsx.mjs';

const ExportExcel = ({ csvData, fileName, wscols, exportFor }) => {

    const numberFormat = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);

    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    if (exportFor === "amortizationSchedule") {
        for (let i = 0; i < csvData.length; i++) {
            {
                csvData[i].payment = numberFormat(csvData[i].payment)
                csvData[i].principal = numberFormat(csvData[i].principal)
                csvData[i].currentBalance = numberFormat(csvData[i].currentBalance)
                csvData[i].interest = numberFormat(csvData[i].interest)
                csvData[i].remainingBalance = numberFormat(csvData[i].remainingBalance)
                csvData[i].cumulativeInterest = numberFormat(csvData[i].cumulativeInterest)
            }
        }

        const Heading = [
            {
                paymentCount: " ",
                paymentDate: "Payment Date",
                currentBalance: "Current Balance",
                payment: "Monthly Payment",
                principal: "Principal",
                interest: "Interest",
                remainingBalance: "Ending Balance",
                cumulativeInterest: "Cumulative Interest"
            }
        ];

        const exportToCSV = (csvData, fileName, wscols) => {
            const ws = XLSX.utils.json_to_sheet(Heading, {
                header: ["paymentCount", "paymentDate", "currentBalance", "payment", "principal", "interest", "remainingBalance", "cumulativeInterest"],
                skipHeader: true,
                origin: 0 //ok
            });
            ws["!cols"] = wscols;
            XLSX.utils.sheet_add_json(ws, csvData, {
                header: ["paymentCount", "paymentDate", "currentBalance", "payment", "principal", "interest", "remainingBalance", "cumulativeInterest"],
                skipHeader: true,
                origin: -1 //ok
            });
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
        };

        return (
            <>
                <svg onClick={e => exportToCSV(csvData, fileName, wscols)} className="hover:cursor-pointer hover:w-[42px] hover:h-[42px]" width="40px" height="40px" viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5.112.006c-2.802 0-5.073 2.273-5.073 5.074v53.841c0 2.803 2.271 5.074 5.073 5.074h45.774c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.902-20.31h-31.946z" fillRule="evenodd" clipRule="evenodd" fill="#45B058"></path><path d="M19.429 53.938c-.216 0-.415-.09-.54-.27l-3.728-4.97-3.745 4.97c-.126.18-.324.27-.54.27-.396 0-.72-.306-.72-.72 0-.144.035-.306.144-.432l3.89-5.131-3.619-4.826c-.09-.126-.145-.27-.145-.414 0-.342.288-.72.721-.72.216 0 .432.108.576.288l3.438 4.628 3.438-4.646c.127-.18.324-.27.541-.27.378 0 .738.306.738.72 0 .144-.036.288-.127.414l-3.619 4.808 3.891 5.149c.09.126.125.27.125.414 0 .396-.324.738-.719.738zm9.989-.126h-5.455c-.595 0-1.081-.486-1.081-1.08v-10.317c0-.396.324-.72.774-.72.396 0 .721.324.721.72v10.065h5.041c.359 0 .648.288.648.648 0 .396-.289.684-.648.684zm6.982.216c-1.782 0-3.188-.594-4.213-1.495-.162-.144-.234-.342-.234-.54 0-.36.27-.756.702-.756.144 0 .306.036.433.144.828.738 1.98 1.314 3.367 1.314 2.143 0 2.826-1.152 2.826-2.071 0-3.097-7.111-1.386-7.111-5.672 0-1.98 1.764-3.331 4.123-3.331 1.548 0 2.881.468 3.853 1.278.162.144.253.342.253.54 0 .36-.307.72-.703.72-.145 0-.307-.054-.432-.162-.883-.72-1.98-1.044-3.079-1.044-1.44 0-2.467.774-2.467 1.909 0 2.701 7.112 1.152 7.112 5.636 0 1.748-1.188 3.53-4.43 3.53z" fill="#ffffff"></path><path d="M55.953 20.352v1h-12.801s-6.312-1.26-6.127-6.707c0 0 .207 5.707 6.002 5.707h12.926z" fillRule="evenodd" clipRule="evenodd" fill="#349C42"></path><path d="M37.049 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.801l-18.905-20.352z" opacity=".5" fillRule="evenodd" clipRule="evenodd" fill="#ffffff"></path></g></svg>
            </>

        )

    }else{

        const simplifiedLoans = csvData.map(loan => ({
            title: loan.title,
            current_balance: loan.current_balance,
            interest: loan.interest,
            interest_frequency: loan.interest_frequency,
            maturity_date: loan.maturity_date,
            budgeted_payment: loan.budgeted_payment,
            payment_frequency: loan.payment_frequency
          }));

        for (let i = 0; i < csvData.length; i++) {
            {
                simplifiedLoans[i].current_balance = numberFormat(simplifiedLoans[i].current_balance)
                simplifiedLoans[i].budgeted_payment = numberFormat(simplifiedLoans[i].budgeted_payment)
            }
        }

        const Heading = [
            {
                title: "Title",
                current_balance: "Current Balance",
                interest: "Interest Rate",
                interest_frequency: "Compound Frequency",
                maturity_date: "Maturity Date",
                budgeted_payment: "Budgeted Monthly Payment Balance",
                payment_frequency: "Payment Frequency"
            }
        ];

        const exportToCSV = (simplifiedLoans, fileName, wscols) => {
            const ws = XLSX.utils.json_to_sheet(Heading, {
                header: ["title", "current_balance", "interest", "interest_frequency", "maturity_date", "budgeted_payment", "payment_frequency"],
                skipHeader: true,
                origin: 0 //ok
            });
            ws["!cols"] = wscols;
            XLSX.utils.sheet_add_json(ws, simplifiedLoans, {
                header: ["title", "current_balance", "interest", "interest_frequency", "maturity_date", "budgeted_payment", "payment_frequency"],
                skipHeader: true,
                origin: -1 //ok
            });
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
        };

        return (
            <>
                <svg onClick={e => exportToCSV(simplifiedLoans, fileName, wscols)} className="hover:cursor-pointer hover:w-[42px] hover:h-[42px]" width="40px" height="40px" viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5.112.006c-2.802 0-5.073 2.273-5.073 5.074v53.841c0 2.803 2.271 5.074 5.073 5.074h45.774c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.902-20.31h-31.946z" fillRule="evenodd" clipRule="evenodd" fill="#45B058"></path><path d="M19.429 53.938c-.216 0-.415-.09-.54-.27l-3.728-4.97-3.745 4.97c-.126.18-.324.27-.54.27-.396 0-.72-.306-.72-.72 0-.144.035-.306.144-.432l3.89-5.131-3.619-4.826c-.09-.126-.145-.27-.145-.414 0-.342.288-.72.721-.72.216 0 .432.108.576.288l3.438 4.628 3.438-4.646c.127-.18.324-.27.541-.27.378 0 .738.306.738.72 0 .144-.036.288-.127.414l-3.619 4.808 3.891 5.149c.09.126.125.27.125.414 0 .396-.324.738-.719.738zm9.989-.126h-5.455c-.595 0-1.081-.486-1.081-1.08v-10.317c0-.396.324-.72.774-.72.396 0 .721.324.721.72v10.065h5.041c.359 0 .648.288.648.648 0 .396-.289.684-.648.684zm6.982.216c-1.782 0-3.188-.594-4.213-1.495-.162-.144-.234-.342-.234-.54 0-.36.27-.756.702-.756.144 0 .306.036.433.144.828.738 1.98 1.314 3.367 1.314 2.143 0 2.826-1.152 2.826-2.071 0-3.097-7.111-1.386-7.111-5.672 0-1.98 1.764-3.331 4.123-3.331 1.548 0 2.881.468 3.853 1.278.162.144.253.342.253.54 0 .36-.307.72-.703.72-.145 0-.307-.054-.432-.162-.883-.72-1.98-1.044-3.079-1.044-1.44 0-2.467.774-2.467 1.909 0 2.701 7.112 1.152 7.112 5.636 0 1.748-1.188 3.53-4.43 3.53z" fill="#ffffff"></path><path d="M55.953 20.352v1h-12.801s-6.312-1.26-6.127-6.707c0 0 .207 5.707 6.002 5.707h12.926z" fillRule="evenodd" clipRule="evenodd" fill="#349C42"></path><path d="M37.049 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.801l-18.905-20.352z" opacity=".5" fillRule="evenodd" clipRule="evenodd" fill="#ffffff"></path></g></svg>
            </>

        )

    }

}

export default ExportExcel