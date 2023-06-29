import styles from './AlgorithmSelector.module.scss';

import { ToggleButton } from '@/components/ToggleButton/ToggleButton';
import { SortAlgorithm } from '@/config';

interface AlgorithmSelectorProps {
    currentAlgorithm: SortAlgorithm;
    algorithms: SortAlgorithm[];
    onSelectedAlgorithmSelected: (algorithm: SortAlgorithm) => void;
}

export const AlgorithmSelector = (props: AlgorithmSelectorProps) => {

    const { currentAlgorithm, algorithms, onSelectedAlgorithmSelected } = props;

    return <div className={styles.algorithmSelector}>
        {algorithms.map(algorithm => {
            return <ToggleButton
                key={algorithm.value}
                active={algorithm.value === currentAlgorithm.value}
                onClick={() => onSelectedAlgorithmSelected(algorithm)}
            >{algorithm.label}
            </ToggleButton>;
        })}
    </div>;
};