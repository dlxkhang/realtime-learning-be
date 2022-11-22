const host = 'http://localhost:3300'
class Template {
    verificationEmail(emailToken: string, toAddress: string) {
        const msg = {
            to: `${toAddress}`, // Change to your recipient
            from: 'dangthi64788296@gmail.com', // Change to your verified sender
            subject: 'Verification Email',
            text: `Click the the link below to verify email
                Link`,
            html: `<strong>Click the the link below to verify email</strong> 
        <a href="${host}/verify-email/${emailToken}">Link</a>
        `,
        }
        return msg
    }
}
export default new Template()
