import { ReactNode, useCallback } from 'react';

import styles from './ToggleButton.module.scss';

interface IToggleButtonProps {
    disabled?: boolean;
    onClick: () => void;
    active: boolean;
    children: ReactNode;
}

export const ToggleButton = (props: IToggleButtonProps) => {

    const { active, onClick, disabled } = props;

    const onButtonClick = useCallback(() => {
        if (disabled) {
            return;
        }
        if (onClick) {
            onClick();
        }
    }, [disabled, onClick]);

    return <button
        className={[styles.toggleButton, active ? styles.active : '', disabled ? styles.disabled : ''].join(' ')}
        onClick={onButtonClick}>
        {props.children}
    </button>;
};