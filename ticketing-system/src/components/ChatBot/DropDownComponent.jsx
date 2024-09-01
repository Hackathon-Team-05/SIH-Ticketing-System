import {useState} from "react";
import {Select} from "antd";

const DropdownComponent = ({
                               childText,
                               setChildText,
                               adultText,
                               setAdultText,
                               foreignerText,
                               setForeignerText,
                               setHintText,
                               setNumberHandle,
                               setNoOfForeignerSelected,
                               setNoOfChildSelected,
                               setNoOfAdultSelected
                           }) => {

    const [childNo, setChildNo] = useState(null);
    const [adultNumber, setAdultNumber] = useState(null);
    const [foreignerNumber, setForeignerNumber] = useState(null);
    const {Option} = Select;

    const childOptions = ['Select child', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const adultOptions = ['Select adult', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const foreignerOptions = ['Select foreigner', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    return (
        <div>

            <Select
                style={{width: 200, marginBottom: '1rem'}}
                text="Select Child Number" placeholder={"Select Child Number"}
                onChange={(value) => {


                    setHintText('Press Send button to continue')
                    setNumberHandle(true)
                     if (value !== "Select foreigner") {
                        setChildNo(value)

                        setNoOfChildSelected(value)

                    }
                }}
                value={childNo}
            >
                {childOptions.map((option, index) => (
                    <Option key={index} value={option}>
                        {option}
                    </Option>
                ))}
            </Select>


            <Select
                style={{width: 200, marginBottom: '1rem'}}
                text="Select Adult Number" placeholder={'Select Adult Number'}
                onChange={(value) => {
                    setHintText('Press Send button to continue')
                    setNumberHandle(true)

                    if (value !== "Select adult") {
                        setAdultNumber(value)

                        setNoOfAdultSelected(value)

                    }

                }}
                value={adultNumber}
            >
                {adultOptions.map((option, index) => (
                    <Option key={index} value={option}>
                        {option}
                    </Option>
                ))}
            </Select>


            <Select
                style={{width: 200, marginBottom: '1rem'}} placeholder={'Select Foreigner Number'}
                text="Select Foreigner Number"
                onChange={(value) => {
                    setNumberHandle(true)

                    setHintText('Press Send button to continue')
                    if (value !== "Select foreigner") {
                        setForeignerNumber(value)

                        setNoOfForeignerSelected(value)

                    }
                }}
                value={foreignerNumber}
            >
                {foreignerOptions.map((option, index) => (
                    <Option key={index} value={option}>
                        {option}
                    </Option>
                ))}
            </Select>

        </div>
    );
};

export default DropdownComponent;
