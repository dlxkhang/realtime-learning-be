import sgMail from '@sendgrid/mail'
import { ENV } from '../common/env'
import { GENERAL_ERROR_CODE } from '../common/error-code'
import { Mail } from '../interfaces/ultis/mail'

//sample mail object
// const msg = {
//   to: 'ketodin423@sopulit.com', // Change to your recipient
//   from: 'test@example.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }

class mailService {
    constructor() {
        sgMail.setApiKey(ENV.SENDGRID_API_KEY)
    }
    async send(msg: Mail) {
        try {
            const res = await sgMail.send(msg)
        } catch (err) {
            console.log('err: ', err.response.body.errors);
            if (err.response && err.response.body) throw new Error(err.response.body.errors)
            throw GENERAL_ERROR_CODE.MAIL_SERVICE_ERROR
        }
    }
}

export default new mailService()
