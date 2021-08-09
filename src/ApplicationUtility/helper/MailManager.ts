'use strict';
import * as nodemailer from 'nodemailer';
import { globalConfig } from '../constant/globalConstant';
const mailConfig = {
    host: globalConfig.EMAIL.PROVIDER,
    secure: true,
    auth: {
        user: globalConfig.EMAIL.USER,
        pass: globalConfig.EMAIL.PASSWORD
    }
};

const transporter = nodemailer.createTransport(mailConfig);
export class MailManager {
    private senderEmail = globalConfig.EMAIL.FROM;
    constructor(private receiverEmail: string, private subject: string, private content: any) {
        this.sendMail();
    }
    async sendMail() {
        try {
            transporter.sendMail({
                from: this.senderEmail,// sender email
                to: this.receiverEmail, // list of receivers
                subject: this.subject, // Subject line
                html: this.content
            }, function (err, success) {
                if (err) {
                    console.log("error", "sending email", err);
                } else {
                    console.log("info", "email send", success);
                }
            })
           
        } catch (error) {
            console.log('Send mail --->', error)
        };
        return {}
    }
}