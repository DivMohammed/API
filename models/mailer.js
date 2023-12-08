const { google } = require("googleapis");
const nodemailer = require("nodemailer");


/*POPULATE BELOW FIELDS WITH YOUR CREDETIALS*/

const CLIENT_ID = "827795597954-5ru05vfrbvhihgc7nmcjjruduclamf7i.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
// const REFRESH_TOKEN = "1//04B1qcRS_p3IHCgYIARAAGAQSNwF-L9IrSaPZ5CW-1VO5kNSa2iELXzHyjvyG4_qV9NG4fdvhrpdxiRj3SVCm53NAp8a1Mc4EnNY";
// const REFRESH_TOKEN = "1//04BZui61_3HkfCgYIARAAGAQSNwF-L9IrJHluV8dvCcEJU5mlEAFpFD_9Y5qRpkAnHMPSMnNiHMG_U9PDrYITgy5gFMC2m3QLzUY";
const REFRESH_TOKEN = "1//04TkKUb8eGSiMCgYIARAAGAQSNwF-L9IrQuUpq-RqfPN_Y-6gy2XcX_qJVvcqD_O7Bvr7nb5xt3GCPyVwRxSTzPclshGXUK2i60M";


const REDIRECT_URI = "https://developers.google.com/oauthplayground"; //DONT EDIT THIS
const MY_EMAIL = "sodom.design.sa@gmail.com";

/*POPULATE ABOVE FIELDS WITH YOUR CREDETIALS*/

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });







//YOU CAN PASS MORE ARGUMENTS TO THIS FUNCTION LIKE CC, TEMPLATES, ATTACHMENTS ETC. IM JUST KEEPING IT SIMPLE
const sendTestEmail = async (to,OTP) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //EMAIL OPTIONS
  const from = MY_EMAIL;
  const subject = "اعادة تعيين كلمة المرور";
  const html = `<!DOCTYPE html>
        <html lang="en" >
    <meta charset="UTF-8">
    <head>
    <title>CodePen - OTP Email Template to ${to}</title>
    </head>
    <body>
    <!-- partial:index.partial.html -->
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Birg</a>
        </div>
        <p style="font-size:1.1em">مرحبا,</p>
        <p>استعمل هذا الرمز لتغيير كلمة المرور , الرمز فعال 5 دقائق فقط</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
        <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Koding 101 Inc</p>
        <p>1600 Amphitheatre Parkway</p>
        <p>California</p>
        </div>
    </div>
    </div>
    <!-- partial -->
        
    </body>
    </html>`;
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};








module.exports = { sendTestEmail };