import React, { useState } from 'react';

const RadioInputs = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  }

  return (
    <div>
      <form>
        <label>
          <input
            type="radio"
            value="option1"
            checked={selectedOption === 'option1'}
            onChange={handleOptionChange}
          />
          Option 1
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="option2"
            checked={selectedOption === 'option2'}
            onChange={handleOptionChange}
          />
          Option 2
        </label>
      </form>
      <input
        type="text"
        placeholder="Input 1"
        style={{ display: selectedOption === 'option1' ? 'block' : 'none' }}
      />
      <input
        type="text"
        placeholder="Input 2"
        style={{ display: selectedOption === 'option2' ? 'block' : 'none' }}
      />
    </div>
  );
};

export default RadioInputs;