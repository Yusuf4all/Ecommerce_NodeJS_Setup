const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = ( data, template_Id, sub )=>{
    let message = {
        to: process.env.MY_TO_EMAIL,
        from: data.Email,
        subject: sub,
        template_id: template_Id,
        dynamic_template_data: {
            data: data
        }
    }
    sgMail.send(message);
}