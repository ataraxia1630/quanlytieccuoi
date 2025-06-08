import { useCallback } from "react";



const useValidation = () => {



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
        validateNumberField,

    };
}

export default useValidation;