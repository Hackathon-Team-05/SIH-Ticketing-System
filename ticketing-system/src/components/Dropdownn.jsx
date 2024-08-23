import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dropdown = () => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [museums, setMuseums] = useState([]);
    const [prices, setPrices] = useState({});


    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedMuseum, setSelectedMuseum] = useState('');
    const [ticketType, setTicketType] = useState('adult');
    const [ticketCount, setTicketCount] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);

    // Fetch states on component mount
    useEffect(() => {
        axios.get('http://localhost:3000/api/states')
            .then(response => setStates(response.data))
            .catch(error => console.error('Error fetching states:', error));
    }, []);

    // Fetch cities when a state is selected
    useEffect(() => {
        if (selectedState) {
            axios.get(`http://localhost:3000/api/cities?state_code=${selectedState}`)
                .then(response => setCities(response.data))
                .catch(error => console.error('Error fetching cities:', error));
        } else {
            setCities([]);
        }
    }, [selectedState]);

    // Fetch museums when a city is selected
    useEffect(() => {
        if (selectedCity) {
            axios.get(`http://localhost:3000/api/museums?city=${selectedCity}`)
                .then(response => setMuseums(response.data))
                .catch(error => console.error('Error fetching museums:', error));
        } else {
            setMuseums([]);
        }
    }, [selectedCity]);

    // Fetch prices when a museum is selected
    useEffect(() => {
        if (selectedMuseum) {
            console.log(selectedMuseum);
            axios.get(`http://localhost:3000/api/prices?museum=${selectedMuseum}`)
                .then(response => setPrices(removeNullValues(response.data)))
                .catch(error => console.error('Error fetching prices:', error));
        }
    }, [selectedMuseum]);

    // Calculate total amount when ticket type or count changes
    useEffect(() => {
        if (prices && prices[ticketType]) {
            const price = prices[ticketType];
            setTotalAmount(ticketCount * price);
        }
    }, [ticketType, ticketCount, prices]);
    

    const removeNullValues = (json) => {
        let updatedJson = {};
        for (let key in json) {
            if (json[key] !== null) {
                updatedJson[key] = json[key];
            }
        }

        return updatedJson;
    };

    const getTicketOptions = (data) => {
        const options = Object.keys(data);
        const f_options = [];

        options.forEach(option => {
            if (option === 'adult_price') {
                f_options.push({ label: 'Adult', value: 'adult_price' });
            } else if (option === 'child_price') {
                f_options.push({ label: 'Child', value: 'child_price' });
            } else if (option === 'foreigner_price') {
                f_options.push({ label: 'Foreigner', value: 'foreigner_price' });
            }
        });

        return f_options;
    };


    return (
        <div>
            <h1>Select a Museum</h1>

            {/* State Dropdown */}
            <div>
                <label>Select State: </label>
                <select
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                >
                    <option value="">--Select State--</option>
                    {states.map(state => (
                        <option key={state.state_code} value={state.state_code}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* City Dropdown */}
            <div>
                <label>Select City: </label>
                <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    disabled={!selectedState} // Disable if no state selected
                >
                    <option value="">--Select City--</option>
                    {cities.map(city => (
                        <option key={city.name} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Museum Dropdown */}
            <div>
                <label>Select Museum: </label>
                <select
                    value={selectedMuseum}
                    onChange={e => setSelectedMuseum(e.target.value)}
                    disabled={!selectedCity} // Disable if no city selected
                >
                    <option value="">--Select Museum--</option>
                    {museums.map(museum => (
                        <option key={museum.id} value={museum.name}>
                            {museum.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ticket Type Dropdown */}
            <div>
                <label>Select Ticket Type: </label>
                <select
                    value={ticketType}
                    onChange={e => setTicketType(e.target.value)}
                    disabled={!selectedMuseum} // Disable if no museum selected
                >
                    {getTicketOptions(prices).map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>


            {/* Ticket Count Input */}
            <div>
                <label>Number of Tickets: </label>
                <input
                    type="number"
                    min="1"
                    value={ticketCount}
                    onChange={e => setTicketCount(e.target.value)}
                    disabled={!selectedMuseum} // Disable if no museum selected
                />
            </div>

            {/* Total Amount */}
            <div>
                <h2>Total Amount: {totalAmount}</h2>
            </div>
        </div>
    );
};

export default Dropdown;
