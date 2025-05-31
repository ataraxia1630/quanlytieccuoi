import { useCallback } from "react";



const useValidation = () => {

    //trường phone number
    const validatePhoneNumberField = useCallback((name, value, setErrors) => {
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;

        if (!value || !phoneRegex.test(value)) {
            setErrors((prev) => ({
                ...prev,
                [name]: "Số điện thoại không hợp lệ. ",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    }, []);


    //các trường thời gian
    const validateTime = useCallback((time) => {
        if (!time || !(time instanceof Date) || isNaN(time)) return false;
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
    }, []);

    const validateTimeField = useCallback((name, value, setErrors) => {
        const timeStr = value instanceof Date ? value.toTimeString() : (value || "");
        if (timeStr && !validateTime(value)) {
            setErrors((prev) => ({
                ...prev,
                [name]: "Giờ phải trong khoảng 00:00:00 - 23:59:59",
            }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }, [validateTime]);



    // các trường số
    const validateNumberField = useCallback((name, value, setErrors) => {
        const numberValue = Number(value);

        if (value === "" || isNaN(numberValue)) {
            setErrors((prev) => ({
                ...prev,
                [name]: "Các giá trị số không hợp lệ.",
            }));
        } else if (numberValue < 0) {
            setErrors((prev) => ({
                ...prev,
                [name]: "Giá trị phải lớn hơn hoặc bằng 0.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }, []);

    return {
        validatePhoneNumberField,
        validateNumberField,
        validateTimeField
    };
}

export default useValidation;