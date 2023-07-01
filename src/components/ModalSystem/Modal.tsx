'use client';

import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';

interface ModalProps {
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal = (props: ModalProps) => {

    const { onClose, title, children } = props;

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

                    <div className={'modal-body'}>
                        {children}
                    </div>
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