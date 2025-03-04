import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dialog.css';
import '../styles/main.css';
function DialogItem(props){
    let path = "/dialogs/" + props.id;
    return(
        <div>
            <div className='dialog_item'>
                <Link to={path}>{props.name}</Link>
            </div>
        </div>
        );
    }
    export default DialogItem;