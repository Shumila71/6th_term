import React from 'react';
import '../styles/Dialog.css';
import '../styles/main.css';
import DialogItem from './DialogItem';
function Dialog(){
    
return(
    <div>
        <div className='dialog'>
            <DialogItem name="Леня" id="1" />
            <DialogItem name="Никита" id="2" />
        </div>
    </div>
    );
}
export default Dialog;