import axios from "axios";

const postdata = async (data) => {
  try {
    const response = await axios.post(
      "https://o05edcws0c.execute-api.ap-south-1.amazonaws.com/payment-gateway-dev/api/payment-success",
      data
    );
    console.log("Ticket inserted successfully:", response.data);
  } catch (error) {
    console.error("Error inserting ticket:", error);
  }
};

export const handlePayment = async (urlForPayment) => {

    try {
        const response = await fetch(urlForPayment, {method: "POST"});
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const options = {
            key: "rzp_test_ZJlM6qFwFKlLhB",
            amount: data.amount * 100,
            currency: "INR",
            name: "MUSEOMATE",
            description: "Test transaction",
            order_id: data.orderId,
            handler: function (response) {
                const jsonobj = {
                    name: data.name,
                    mobile_no: data.mobile_number,
                    noofchildren: data.no_of_children,
                    noofforeigners: data.no_of_foreigners,
                    noofadults: data.no_of_adults,
                    museum_name: data.museum_name,
                    status: data.status,
                    date: data.date,
                    events: data.events,
                    paymentdetails: response,
                };


                console.log(jsonobj);
                postdata(jsonobj)
            },
            prefill: {
                name: "SangramAI",
                email: "sangramAI@sangram.com",
                contact: "0603988787",
            },
            theme: {
                color: "#3399cc",
            },
        };

        if (window.Razorpay) {
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            throw new Error("Razorpay script not loaded");
        }
    } catch (err) {
        console.error("Payment failed", err);
    }
};