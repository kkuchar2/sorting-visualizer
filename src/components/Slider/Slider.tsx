import styles from './Slider.module.scss';

interface SliderProps {
    id: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export const Slider = (props: SliderProps) => {

    const { id, value, onChange, min, max } = props;

    return <input
        id={id}
        className={styles.slider}
        type={'range'}
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
    />;
};