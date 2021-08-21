import React from "react";
import classNames from "classnames";
import {Slider, Text} from "kuchkr-react-component-library";

import "./SliderWithInput.scss";

export const SliderWithInput = (props) => {

    const {
        text,
        description,
        logarithmic,
        markValues,
        value,
        min,
        max,
        disabled,
        onSliderChange,
        onInputChange,
        theme
    } = props;

    return <div className={classNames("sliderWithInput", {disabled: disabled})}>
        <div className={"title"}>
            <Text theme={Text.darkTheme} className={"title"} text={text}/>
        </div>

        <Text theme={Text.darkTheme} className={"description"} text={description}/>

        <div className={"sliderAndInput"}>
            <Slider
                theme={theme}
                min={min}
                max={max}
                logarithmic={logarithmic}
                markValues={markValues}
                included={false}
                disabled={disabled}
                value={value}
                onChange={onSliderChange}/>

            <div className={"valueInput"}>
                {/*<Input*/}
                {/*    id="fname"*/}
                {/*    name="fname"*/}
                {/*    disabled={disabled}*/}
                {/*    value={Math.ceil(value)}*/}
                {/*    active={true}*/}
                {/*    onChange={onInputChange}/>*/}
            </div>
        </div>
    </div>;
}