const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async ( data, template_Id, sub )=>{
    let message = {
        to: data.Email,
        from: process.env.MY_TO_EMAIL,
        subject: sub,
        template_id: template_Id,
        dynamic_template_data: {
            data: data
        }
    }
    await sgMail.send(message);
}