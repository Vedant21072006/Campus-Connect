import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'mail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
})

export default transporter