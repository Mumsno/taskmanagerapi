const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SGAPI


sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'no-reply@amitWeb.com',
        subject: 'Thanks for joining In!',
        text: `Welcome to the app, ${name}. I don't really care if you enjoy it`
        // html
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'no-reply@amitWeb.com',
        subject: 'Bye!',
        text: `Good Bye ${name}, I didn't like you at all`
        // html
    })
}
module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}