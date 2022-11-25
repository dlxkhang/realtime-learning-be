import { ENV } from './env'
class Template {
    verificationEmail(emailToken: string, toAddress: string) {
        const msg = {
            to: `${toAddress}`, // Change to your recipient
            from: 'noreply@gmail.com', // Change to your verified sender
            subject: 'Verification Email',
            text: `Click the the link below to verify email
                Link`,
            html: `<strong>Click the the link below to verify email</strong> 
        <a href="${ENV.APP_BASE_URL}/auth/verify-email/${emailToken}">Link</a>
        `,
        }
        return msg
    }

    invitationEmail(to: string, inviterName: string, groupName: string, invitationLink: string) {
        const msg = {
            to: to,
            from: 'noreply@gmail.com',
            subject: 'Invite To Group',
            text: `You are invited to join ${groupName} by ${inviterName}`,
            html: `<a href="${invitationLink}">Join Group</a>`,
        }
        return msg
    }
}
export default new Template()
