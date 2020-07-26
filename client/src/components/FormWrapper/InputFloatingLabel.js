import React, { useState } from 'react';
import styles from './InputFloatingLabel.module.scss';

const FloatingInput = ({ inputName, labelName, inputValue, handleChange, inputType, isError }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocused = () => {
        setIsFocused(true);
    }

    const handleBlured = () => {
        setIsFocused(false);
    }

    let attachedLabelClasses = [styles.Label];
    if (isFocused || inputValue.length > 0) {
        attachedLabelClasses = [styles.Label, styles.Focused];
    }

    return (
        <div className={styles.InputWrapper}>
            <label htmlFor={inputName} className={attachedLabelClasses.join(' ')}>{labelName}</label>
            <input
                className={styles.Input}
                id={inputName}
                value={inputValue}
                name={inputName}
                onFocus={handleFocused}
                onBlur={handleBlured}
                onChange={handleChange}
                type={inputType}
                style={isError ? { borderColor: 'red' } : null}
            />
        </div>
    )
}

export default FloatingInput
