import styles from './AlgorithmSelector.module.scss';

import { ToggleButton } from '@/components/ToggleButton/ToggleButton';
import { SortAlgorithm } from '@/config';

interface AlgorithmSelectorProps {
    disabled?: boolean;
    currentAlgorithm: SortAlgorithm;
    algorithms: SortAlgorithm[];
    onSelectedAlgorithmSelected: (algorithm: SortAlgorithm) => void;
}

export const AlgorithmSelector = (props: AlgorithmSelectorProps) => {

    const { currentAlgorithm, algorithms, onSelectedAlgorithmSelected, disabled } = props;

    return <div className={styles.algorithmSelector}>
        {algorithms.map(algorithm => {
            return <ToggleButton
                disabled={disabled}
                key={algorithm.value}
                active={algorithm.value === currentAlgorithm.value}
                onClick={() => onSelectedAlgorithmSelected(algorithm)}
            >{algorithm.label}
            </ToggleButton>;
        })}
    </div>;
};