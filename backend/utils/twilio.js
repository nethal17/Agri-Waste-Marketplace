import twilio from "twilio";


const accountSid = `AC5778d93dc2110328964bb064ac460b4c`;
const authToken = `2b7b359260391c7e00219af3cfc8426c`;
const twilioPhoneNumber = `+15005550006`;

console.log("Twilio Account SID:", accountSid);
console.log("Twilio Auth Token:", authToken ? "***" : "Not set");
console.log("Twilio Phone Number:", twilioPhoneNumber);

const client = twilio(accountSid, authToken);

export const sendVerificationCodeViaSMS = async (phone, code) => {
    try {
        const message = await client.messages.create({
            body: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
            from: twilioPhoneNumber,
            to: User.phone,
        });
        console.log("SMS sent:", message.sid);
    } catch (err) {
        console.error("Error sending SMS:", err);
        throw err;
    }
};