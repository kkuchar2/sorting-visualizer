import React from 'react';

import styles from './AlgorithmListItem.module.scss';

import { SortAlgorithm } from '@/config';

interface AlgorithmListItemProps {
    algorithm: SortAlgorithm;
    onClick: (algorithm: SortAlgorithm) => void;
}

export const AlgorithmListItem = (props: AlgorithmListItemProps) => {

    const { algorithm, onClick } = props;

    return <button
        className={styles.algoListItem}
        onClick={() => onClick(algorithm)}>
        {algorithm.label}
    </button>;
};