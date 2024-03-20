import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  auth: {
    user: process.env.SMPT_USER,
    pass: process.env.SMPT_PASS,
  },
});

const emailSender = async (obj) => {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail(obj);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

// order verification email sent to user
export const sendOrderVerificationEmailNotification = ({
  toEmail,
  name,
  shippingStreet,
  shippingState,
  shippingZip,
  carts,
  amount,
}) => {
  const body = {
    from: `Variété Vortéx 👻 <${process.env.SMPT_USER}>`, // sender address
    to: toEmail.map((email) => email), // list of receivers
    subject: "Your order has been successfully placed!", // Subject line
    text: `Hello ${
      toEmail.length === 1 ? name : "all"
    },\n\nYour order has been successfully placed. While you eagerly await the arrival of your order, please feel free to explore our wide range of products by visiting our page.\n\nYour order details:
    
   
    ${carts
      .map(
        (item) =>
          `${item.productName} / ${item.orderedSize} X ${item.orderedQty} - ${item.totalPrice}`
      )
      .join("\n\n")}
   

    Total: ${amount}
    
    Your order will be shipped to following address:\n${shippingStreet}, ${shippingState}, ${shippingZip}\n\nIf the address is incorrect, please contact us immediately. \n\n Happy shopping! 🛍️\n\n---------\nRegards,\nVariété Vortéx`, // plain text body
    html: `<p>Hello ${toEmail.length === 1 ? name : "all"},</p>
    
    <p>Your order has been successfully placed. While you eagerly await the arrival of your order, please feel free to explore our wide range of products by visiting our page.</p>

    <p>Your order details:</p>

    <ul>
    ${carts
      .map(
        (item) => `
        <li>
          <img src="http://localhost:8000${item.thumbnail}" alt="${item.productName}" width="60" height="60" />
          <p>${item.productName} / ${item.orderedSize} X ${item.orderedQty} - ${item.totalPrice}</p>
        </li>
      `
      )
      .join("")}
    </ul>

    <p>Total: ${amount}</p>

    <p>Your order will be shipped to following address:\n ${shippingStreet}, ${shippingState}, ${shippingZip}</p>

    <p>If the address is incorrect, please contact us immediately.</p>
    
    <br/>

    <p>Happy shopping! 🛍️</p>

    <br/>
    <br/>
    
    ---------
    
    <p>
      Regards,
      <br/>
      Variété Vortéx
      <br/>
    </p>`, // html body
  };

  emailSender(body);
};

// email verification link to user after they create their account
export const sendEmailVerificationLinkTemplate = ({ email, fname, url }) => {
  const body = {
    from: `"Variété Vortéx 👻" <${process.env.SMPT_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Follow the instruction to verify your account!", // Subject line
    text: `Hello ${fname}, please follow the link to verify your account ${url}\n\n Regards,\nVariété Vortéx`, // plain text body
    html: `<p>Hello ${fname}</p>

    <br/>
    <br/>
    
    <p>Thank you for creating account with us. Click the button to verify your account!</p>
    
    <p>
      <a href="${url}">
      <button style=background: green; padding:9px;color:"white"; fontWeight:bold;>Verify</button>
      </a>
    </p>
    
    <br/>
    <br/>
    <br/>

    <p>If the button doesn't work, please copy the link and paste it to your browser "${url}"</p>

    <br/>
    <br/>
    <br/>
    
    ---------
    
    <p>
      Regards,
      <br/>
      Variété Vortéx
      <br/>
    </p>`, // html body
  };

  emailSender(body);
};

export const sendEmailVerifiedNotification = ({ email, fname }) => {
  const body = {
    from: `"Variété Vortéx 👻" <${process.env.SMPT_USER}>`, // sender address
    to: email, // list of receivers
    subject: "your email has been verified!", // Subject line
    text: `Hello ${fname},\n\n Thank you for creating account with us. Your account has been verified. You may login now.\n\n Regards,\nVariété Vortéx`, // plain text body
    html: `<p>Hello ${fname},</p>

    <br/>
    <br/>
    
    <p>Thank you for creating account with us. Your account has been verified.</p>
    
    <br/>
    <br/>
    <br/>

    <p>You may login now!"</p>

    <br/>
    <br/>
    <br/>
    
    ---------
    
    <p>
      Regards,
      <br/>
      Variété Vortéx
      <br/>
    </p>`, // html body
  };

  emailSender(body);
};

// while subscribing
export const sendSubscriptionVerifiedNotification = ({ email, url }) => {
  const body = {
    from: `"Variété Vortéx 👻" <${process.env.SMPT_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Welcome to Our Newsletter Community!", // Subject line
    text: `Dear ${email},\n\nWelcome aboard! 🎉\n\nThank you for subscribing to our newsletter. We're thrilled to have you join our community of engaged readers. You're now connected to a wealth of valuable insights, weekly articles, and exciting product updates.\n\nAt Variété Vortéx, we are dedicated to delivering excellence in all aspects of our services. Rest assured, we value your time and privacy, which is why you'll only receive relevant and meaningful content from us. We promise never to clutter your inbox with spam emails.\n\nStay tuned for our upcoming newsletters, packed with informative articles, insightful tips, and exciting announcements. If you ever have any questions or feedback, please feel free to reach out to us. Your input is invaluable to us as we strive to continuously improve and tailor our content to meet your needs.\n\nOnce again, welcome to our newsletter community! We're delighted to have you on this journey with us.\n\nYou can unsubscribe anytime by following the link ${url}\n\n---------\nRegards,\nVariété Vortéx`, // plain text body
    html: `<p>Dear ${email},</p>
    
    <p>Welcome aboard! 🎉</p>

    <p>Thank you for subscribing to our newsletter. We're thrilled to have you join our community of engaged readers. You're now connected to a wealth of valuable insights, weekly articles, and exciting product updates.</p>
    
    <p>At <b>Variété Vortéx</b>, we are dedicated to delivering excellence in all aspects of our services. Rest assured, we value your time and privacy, which is why you'll only receive relevant and meaningful content from us. We promise never to clutter your inbox with spam emails.</p>
    
    <p>As a subscriber, you're at the forefront of everything we do. Whether you're seeking industry trends, expert advice, or exclusive offers, we're here to provide you with valuable resources and enriching experiences.</p>
    
    <p>Stay tuned for our upcoming newsletters, packed with informative articles, insightful tips, and exciting announcements. If you ever have any questions or feedback, please feel free to reach out to us. Your input is invaluable to us as we strive to continuously improve and tailor our content to meet your needs.</p>
    
    <p>Once again, welcome to our newsletter community! We're delighted to have you on this journey with us.</p>

    <p>You can unsubscribe anytime by clicking the button below.</p>
    <p>
      <a href="${url}">
      <button style=background: green; padding:9px;color:"white"; fontWeight:bold;>Unsubscribe</button>
      </a>
    </p>

    <p>If the button doesn't work, please copy the link and paste it to your browser: ${url}</p>

    <br/>
    <br/>
    
    ---------
    
    <p>
      Regards,
      <br/>
      Variété Vortéx
      <br/>
    </p>`, // html body
  };

  emailSender(body);
};

// while unsubscribing
export const sendUnsubscriptionVerifiedNotification = ({ email }) => {
  const body = {
    from: `"Variété Vortéx 👻" <${process.env.SMPT_USER}>`, // sender address
    to: email, // list of receivers
    subject: "We are sorry to See You Go!", // Subject line
    text: `Dear ${email},\n\nThis email is to confirm that your unsubscription request has been successfully processed. You will no longer receive emails from us.\n\nWe're sorry to see you go, but we understand that preferences change. If you ever wish to resubscribe or have any feedback for us, please don't hesitate to contact us.\n\nThank you for being a part of our community, and we wish you all the best in your future endeavors.\n\n---------\nRegards,\nVariété Vortéx`, // plain text body
    html: `<p>Dear ${email},</p>
    
    <p>This email is to confirm that your unsubscription request has been successfully processed. You will no longer receive emails from us.</p>

    <p>We're sorry to see you go, but we understand that preferences change. If you ever wish to resubscribe or have any feedback for us, please don't hesitate to contact us.</p>

    <p>Thank you for being a part of our community, and we wish you all the best in your future endeavors.</p>

    <br/>
    <br/>
    
    ---------
    
    <p>
      Regards,
      <br/>
      Variété Vortéx
      <br/>
    </p>`, // html body
  };

  emailSender(body);
};
