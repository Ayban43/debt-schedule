import React from 'react';
import './RadioButton.css';

const RadioButton = ({ value, name ,id, checked, onChange }) => (

            <input
            type="radio"
            name={name}
            value={value}
            id={id}
            checked={checked}
            onChange={onChange}
            />
);

export default RadioButton;
