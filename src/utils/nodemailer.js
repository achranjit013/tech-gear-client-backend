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
    from: `Tech Gear 👻 <${process.env.SMPT_USER}>`, // sender address
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
    
    Your order will be shipped to following address:\n${shippingStreet}, ${shippingState}, ${shippingZip}\n\nIf the address is incorrect, please contact us immediately. \n\n Happy shopping! 🛍️\n\n---------\nRegards,\nTech Gear`, // plain text body
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
      Tech Gear
      <br/>
    </p>`, // html body
  };

  emailSender(body);
};
