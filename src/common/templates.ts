import { ENV } from './env'
class Template {
    verificationEmail(emailToken: string, toAddress: string) {
        const msg = {
            to: `${toAddress}`, // Change to your recipient
            from: ENV.SENDGRID_SENDER, // Change to your verified sender
            subject: 'Verification Email',
            text: `Click the the link below to verify email
                Link`,
            html: `<strong>Click the the link below to verify email</strong> 
        <a href="${ENV.APP_BASE_URL}/verify-email/${emailToken}">Link</a>
        `,
        }
        return msg
    }

    invitationEmail(to: string, inviterName: string, groupName: string, invitationLink: string) {
        const msg = {
            to: to,
            from: ENV.SENDGRID_SENDER,
            subject: 'Invite To Group',
            text: `You are invited to join ${groupName} by ${inviterName}`,
            html: `<a href="${invitationLink}">Join Group</a>`,
        }
        return msg
    }

    presentationInvitationEmail(
        to: string,
        inviterName: string,
        presentationName: string,
        invitationLink: string,
    ) {
        const msg = {
            to: to,
            from: ENV.SENDGRID_SENDER,
            subject: 'Invite To Presentation',
            text: `You are invited to collaborate ${presentationName} by ${inviterName}`,
            html: `<a href="${invitationLink}">Join Presentation</a>`,
        }
        return msg
    }

    resetPassword(to: string, newPassword: string) {
        const msg = {
            to: `${to}`, // Change to your recipient
            from: ENV.SENDGRID_SENDER, // Change to your verified sender
            subject: 'Reset Password',
            text: `Here is your new password: ${newPassword}, please use this to login and change it later`,
            html: `Here is your new password: ${newPassword}, please use this to login and change it later`,
        }
        return msg
    }
}
export default new Template()
