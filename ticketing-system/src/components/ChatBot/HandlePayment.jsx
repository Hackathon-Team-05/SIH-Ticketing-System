import axios from "axios";
const backendPort = 8080;
const postdata = async (data) => {
    try {
        const response = await axios.post(
            `http://localhost:${backendPort}/api/payment-success`,
            data
        );

        console.log("Ticket inserted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error inserting ticket:", error);
        throw error;
    }
};

export const handlePayment = async (urlForPayment) => {
    try {
        const response = await fetch(urlForPayment, {method: "POST"});
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();


        return new Promise((resolve, reject) => {
            const options = {
                key: "rzp_test_ZJlM6qFwFKlLhB",
                amount: data.amount * 100,
                currency: "INR",
                name: "MUSEOMATE",
                description: "Test transaction",
                order_id: data.orderId,
                handler: async function (response) {
                    const jsonobj = {
                        name: data.name,
                        mobile_no: data.mobile_number,
                        noofchildren: data.no_of_children,
                        noofforeigners: data.no_of_foreigners,
                        noofadults: data.no_of_adults,
                        museum_name: data.museum_name,
                        museum_id: data.museum_id,
                        status: data.status,
                        date: data.date,
                        events: data.events,
                        paymentdetails: response,
                    };

                    console.log(jsonobj);
                    try {
                        const ticketID = await postdata(jsonobj);
                        resolve(ticketID);
                    } catch (error) {
                        reject(error);
                    }
                },
                prefill: {
                    name: data.name,
                    contact: data.mobile_number,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            if (window.Razorpay) {
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                console.error("Razorpay script not loaded");
                reject(new Error("Razorpay script not loaded"));
            }
        });
    } catch (err) {
        console.error("Payment failed", err);
        throw err;
    }
};

