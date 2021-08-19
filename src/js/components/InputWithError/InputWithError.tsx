import React, {useState, useCallback, useEffect} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import { Input, Text } from "kuchkr-react-component-library";

export const InputWithError = (props) => {

    const [error, setError] = useState(undefined);

    const {errorProviderFunc} = props;

    useEffect(() => setError(errorProviderFunc(props.errors, props.id)), [props.id, props.errors]);

    const renderError = useCallback(() => {
        if (error === undefined || error === null) {
            return;
        }
        if (error.length === 0) {
            return;
        }

        let rows = [];
        for (let i = 0; i < error.length; i++) {
            rows.push(<div key={i} className={"errorWrapper"}>
                <FontAwesomeIcon className={"errorIcon"} icon={faExclamationCircle}/>
                <Text theme={Text.darkTheme} className={"errorText"} text={error[i]['message']}/>
            </div>);
        }
        return <>{rows}</>;
    }, [error]);

    const onChange = useCallback(props.onChange, []);

    const getClassName = useCallback(() => error !== undefined ? 'error' : 'noError', [error]);

    return <>
        <Input
            className={getClassName()}
            title={props.title}
            id={props.id}
            type={props.type}
            onChange={onChange}
            autoComplete={props.autoComplete}
            placeholder={props.placeholder}/>
        {renderError()}
    </>;
}

export const renderInput = (id, title, type, placeholder, autocomplete, onChange, err) => {
    return <InputWithError id={id} title={title} type={type} placeholder={placeholder} onChange={onChange} errors={err} />;
};