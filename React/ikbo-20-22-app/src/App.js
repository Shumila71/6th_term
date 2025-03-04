import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import AgreementForm from './components/AgreementForm';
import './styles/main.css';

const App = () => {
    return (
        <Provider store={store}>
        <div>
            <h1>Соглашайся, брат</h1>
            <AgreementForm/>
        </div>
        </Provider>
    );
};
export default App;