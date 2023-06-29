import { ReactNode } from 'react';

import styles from './ToggleButton.module.scss';

interface IToggleButtonProps {
    onClick: () => void;
    active: boolean;
    children: ReactNode;
}

export const ToggleButton = (props: IToggleButtonProps) => {

    const { active, onClick } = props;

    return <button
        className={[styles.toggleButton, active ? styles.active : ''].join(' ')} onClick={onClick}>
        {props.children}
    </button>;
};