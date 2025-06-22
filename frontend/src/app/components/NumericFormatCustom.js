import { NumericFormat } from 'react-number-format';

// Component tùy chỉnh cho NumericFormat
const NumericFormatCustom = ({ inputRef, onChange, ...other }) => {
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value, // Giá trị thô (số)
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      allowLeadingZeros={false} // Không cho phép số 0 ở đầu
    />
  );
};

export default NumericFormatCustom;
