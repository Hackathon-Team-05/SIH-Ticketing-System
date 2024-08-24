import PhoneInput from "react-phone-input-2";
import {useState} from "react";

const PhoneNumberInput = () => {
  const [phone, setPhone] = useState('');

  const handleChange = (value) => {

    if (value.replace(/\D/g, '').length <= 10) {
      setPhone(value);
    }
  };

  return (
    <PhoneInput
      country={'us'}
      value={phone}
      onChange={handleChange}
      inputProps={{
        name: 'phone',
        required: true,
        autoFocus: true,
      }}
      isValid={(value) => {

        const phoneNumber = value.replace(/\D/g, '');
        return phoneNumber.length === 10;
      }}
    />
  );
};

export default PhoneNumberInput;
