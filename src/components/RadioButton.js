import React from 'react';
// import './RadioButton.css';

// const RadioButton = ({ value, name ,id, checked, onChange }) => (

//             <input
//             type="radio"
//             name={name}
//             value={value}
//             required
//             id={id}
//             checked={checked}
//             onChange={onChange}
//             />
// );

const RadioButton = ({ id, value, name, checked, onChange, label }) => (

    <li className="w-full items-center">
            <input id={id} type="radio" value={value} name={name} checked={checked} onChange={onChange} className="hidden peer cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
            <label htmlFor={id} className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="block">
                    <div className="w-full text-sm font-semibold">{label}</div>
                </div>
                {/* <svg aria-hidden="true" className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg> */}
            </label>
    </li>


)

export default RadioButton;
