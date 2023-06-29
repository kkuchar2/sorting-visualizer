'use client';

import React, { useEffect, useState } from 'react';

import Scrollbars from 'react-custom-scrollbars-2';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, children, title }) => {

    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };

    const onOverlayClick = (e) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = (

        <div className={'modal-overlay'} onClick={onOverlayClick}>
            <div className={'modal-wrapper'}>

                <div className={'modal'}>
                    <div className={'modal-header'}>
                        {title && <h1 className={'text-2xl font-semibold tracking-tight text-white'}>{title}</h1>}
                        <button className={'close-button'} onClick={handleCloseClick}>
                            <div className={'line line-1'}/>
                            <div className={'line line-2'}/>
                        </button>
                    </div>

                    <Scrollbars style={{ width: '100%', height: 300 }}>
                        <div className={'modal-body'}>
                            {children}
                        </div>
                    </Scrollbars>

                </div>
            </div>
        </div>

    );

    if (!mount) {
        return null;
    }

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('modal-root')
    );
};

export default Modal;