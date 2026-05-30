const restfullBookerPaylods = {

    authPayload: async function () {
        return {
            username: 'admin',
            password: 'password123'
        };
    },

    bookingPayload: async function (firstname = 'Jane', lastname = 'Doe') {
        const now = new Date();
        const checkin = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const checkout = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000);

        return {
            firstname: firstname,
            lastname: lastname,
            totalprice: randomNumber(),
            depositpaid: true,
            bookingdates: {
            checkin: checkin.toISOString().split('T')[0],
            checkout: checkout.toISOString().split('T')[0],
            },
            additionalneeds: 'Breakfast',
        }; 
    },

    getBookingByCheckinDatesPayload: async function (checkin, checkout) {
        return {
            checkin: checkin,
            checkout: checkout
        };
    },
     
    getBookingByUserDetailsPayload: async function (firstname, lastname) {
        return {
            firstname: firstname,
            lastname: lastname
        };
    },

    partialUpdateBookingPayload: async function (name = 'UpdatedJane', lastname = null) {
        if (lastname === null) {
            return {
                firstname: name,
                totalprice: randomNumber()
            };
        } else {
            return {
                firstname: name,
                lastname: lastname,
            };
        }
    },

    updateBookingPayload: async function (firstname = 'UpdatedJane', lastname = 'UpdatedDoe') {
        const now = new Date();
        const checkin = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const checkout = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000);

        return {
            firstname: firstname,
            lastname: lastname,
            totalprice: randomNumber(),
            depositpaid: false,
            bookingdates: {
                checkin: checkin.toISOString().split('T')[0],
                checkout: checkout.toISOString().split('T')[0],
            },
            additionalneeds: 'Late Checkout',
        };
    }
};

export default restfullBookerPaylods;

function randomNumber() {
    const min = 100;
    const max = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}