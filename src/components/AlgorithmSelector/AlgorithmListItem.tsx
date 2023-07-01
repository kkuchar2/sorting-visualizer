import React from 'react';

import styles from './AlgorithmListItem.module.scss';

import { SortAlgorithm } from '@/config';

interface AlgorithmListItemProps {
    algorithm: SortAlgorithm;
    currentAlgorithm?: SortAlgorithm;
    onClick: (algorithm: SortAlgorithm) => void;
}

export const AlgorithmListItem = (props: AlgorithmListItemProps) => {

    const { algorithm, currentAlgorithm, onClick } = props;

    return <button
        className={[styles.algoListItem, currentAlgorithm?.value === algorithm.value ? styles.active : ''].join(' ')}
        onClick={() => onClick(algorithm)}>
        {algorithm.label}
    </button>;
};