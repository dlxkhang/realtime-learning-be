import sgMail from '@sendgrid/mail'
import { Mail } from '../interfaces/ultis/mail'
sgMail.setApiKey('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')

//sample mail object
// const msg = {
//   to: 'ketodin423@sopulit.com', // Change to your recipient
//   from: 'test@example.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }

class mailService {
    sendVerificationEmail(msg: Mail) {
        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
            })
            .catch((error) => {
                console.error(error)
            })
    }
}

export default new mailService()
