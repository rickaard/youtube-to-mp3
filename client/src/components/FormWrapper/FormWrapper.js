import React, { useState, useEffect } from 'react';
import InputFloatingLabel from './InputFloatingLabel';
import styles from './FormWrapper.module.scss';


export const validateYoutubeLink = (input) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const match = input.match(regExp);
    if (!match) {
        return false;
    }
    return {
        link: match[0],
        id: match[1]
    };
}

const FormWrapper = ({ getVideo }) => {
    const [inputValue, setInputValue] = useState('');
    const [validationError, setValidationError] = useState({ isError: false, errorMsg: '' });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!inputValue.trim()) return setValidationError({ ...validationError, isError: true });

        // make sure inputted URL is a valid youtube link
        const youtubeinfo = validateYoutubeLink(inputValue);
        // show error message if not
        if (!youtubeinfo) {
            setValidationError({ ...validationError, isError: true, errorMsg: 'Not a valid Youtube link' });
            return;
        }
        // console.log(youtubeinfo);
        getVideo(youtubeinfo.link, youtubeinfo.id);
        return;
    }



    const handleChange = (e) => {
        setValidationError({ isError: false, errorMsg: '' })
        setInputValue(e.target.value)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <InputFloatingLabel
                inputName="youtube-link"
                inputValue={inputValue}
                handleChange={handleChange}
                labelName="Paste the youtube link here"
                inputType="text"
                isError={validationError.isError}
            />
            <button type="submit">GO</button>
            {validationError.isError && validationError.errorMsg && <p className={styles.errormsg}>{validationError.errorMsg}</p>}
        </form>
    )
}

export default FormWrapper
