import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAgreement } from '../actions/actions';
import '../styles/agreement.css'

const AgreementForm = () => {

  const dispatch = useDispatch();
  const isAgreed = useSelector((state) => state.isAgreed);

  const handleCheckboxChange = (e) => {
    dispatch(toggleAgreement(e.target.checked)); // Отправляем действие в Redux
  };

  const buttonStyle = {
    backgroundColor: isAgreed ? 'green' : 'gray', 
    color: 'white',
    'margin-left': '20px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: isAgreed ? 'pointer' : 'not-allowed', 
  };

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={isAgreed}
          onChange={handleCheckboxChange}
        />
        Я отдаю владельцу сайта свой гараж.
      </label>
      <button type="submit" disabled={!isAgreed} style={buttonStyle}>
        Честно-честно, подписка!
      </button>
    </form>
  );
};

export default AgreementForm;