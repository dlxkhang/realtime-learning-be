// import Template from '../../common/templates'
// import mailService from '../../ultis/mailService'
// Template.verificationEmail("emailToken", 'yenir18874@turuma.com')
// mailService.sendVerificationEmail()
import sgMail from '@sendgrid/mail'
import { Mail } from '../../interfaces/ultis/mail'
sgMail.setApiKey('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')

//sample mail object
const msg = {
    to: 'kanoheh579@turuma.com', // Change to your recipient
    from: 'dangthi64788296@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

function sendVerificationEmail(msg: Mail) {
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
sendVerificationEmail(msg)
