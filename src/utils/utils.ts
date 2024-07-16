import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

interface User {
  id: number,
  email: string, 
  password: string
  recoveryPasswordId: string
}

export function signJsonWebToken(usr: User) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  const token = jwt.sign({
    data: usr,
  }, jwtSecret, { expiresIn: '6h' });
  return token;
}

export function getErrorMessage(error: any) {
  console.log(error);
  const message = error.errors[0];
  return {
    [message.path]: error.original.message,
  };
}

export function signInEmail(user: User) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const email = {
      body: {
        // name: user.name,
        intro: `
          <p>Please be informed of a recent login activity on your Kings Avatar as of ${new Date().toLocaleString()}.</p>
          <p>If you initiated this login, you can disregard this message.</p>
          <p>If you did not perform this login, we recommend taking the following actions to secure your account:</p>
          <ol>
            <li>Change your password immediately by visiting the following link: <a href="https://product-square-invoice.netlify.app/resetPasswordEmail">Reset Password</a></li>
            <li>Review your account activity for any unauthorized actions.</li>
          </ol>
        `,
        outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'KBS Team',
        link: 'https://mailgen.js/',
      },
    });

    const emailBody = MailGenerator.generate(email);

    const mailOptions = {
      from: '"KBS" <kingsbusinesssuite@gmail.com>',
      to: user.email,
      subject: '[KBS] Login',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'Error sending email' });
      }
      console.log(`Email sent: ${info.response}`);
      return;
    });
  });
}

export function signUpEmail(user: User) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const email = {
      body: {
        // name: user.name,
        intro: `
          <p>Welcome to Kings Avatar!</p>

          <p>Please be informed of your successful sign-up on Kings Avatar as of ${new Date().toLocaleString()}.</p>

          <p>Explore our features and start creating your avatar.</p>
        `,
        action: {
          instructions: 'Use the link below to sign into your Kings Avatar account and get started',
          button: {
            color: '#1da1f2', // Optional action button color
            text: 'Login',
            link: 'https://product-square-invoice.netlify.app/',
          },
        },
        outro: "Need further assistance? Feel free to reply to this email, we're here to help.",
      },
    };

    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'KBS Team',
        link: 'https://mailgen.js/',
      },
    });

    const emailBody = MailGenerator.generate(email);

    const mailOptions = {
      from: '"KBS" <kingsbusinesssuite@gmail.com>',
      to: user.email,
      subject: '[KBS] Sign up',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'Error sending email' });
      }
      console.log(`Email sent: ${info.response}`);
      return;
    });
  });
}

export function changePasswordEmail(user: User) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const email = {
      body: {
        // name: user.name,
        intro: 'Your Kings Avatar password has recently changed.',
        outro: "If you didn’t request this change, Feel free to reply to this email, we're here to help.",
      },
    };

    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'KBS Team',
        link: 'https://mailgen.js/',
      },
    });

    const emailBody = MailGenerator.generate(email);

    const mailOptions = {
      from: '"KBS" <kingsbusinesssuite@gmail.com>',
      to: user.email,
      subject: '[KBS] Change password',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'Error sending email' });
      }
      console.log(`Email sent: ${info.response}`);
      return;
    });
  });
}

export function forgotPasswordEmail(user: User) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const email = {
      body: {
        // name: user.name,
        intro: 'We’ve received your request to reset your password.',
        action: {
          instructions: 'Please click the link below to complete the reset.',
          button: {
            color: '#1da1f2', // Optional action button color
            text: 'Reset password',
            // link: `https://product-square-invoice.netlify.app/resetPassword?recoveryPasswordId=${user.recoveryPasswordId}`,
            link: `http://localhost:3000/resetPassword?recoveryPasswordId=${user.recoveryPasswordId}`,
          },
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
      },
    };

    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'KBS Team',
        link: 'https://mailgen.js/',
      },
    });

    const emailBody = MailGenerator.generate(email);

    const mailOptions = {
      from: '"KBS" <kingsbusinesssuite@gmail.com>',
      to: user.email,
      subject: '[KBS] Reset password',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'Error sending email' });
      }
      console.log(`Email sent: ${info.response}`);
      return resolve({ message: 'Email sent successfully' });
    });
  });
}

export function resetPasswordEmail(user: User) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const email = {
      body: {
        // name: user.name,
        intro: 'Your KBS Invoice password was recently reset.',
        outro: "If you did not reset your password, please contact us immediately, we're here to help.",
      },
    };

    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'KBS Team',
        link: 'https://mailgen.js/',
      },
    });

    const emailBody = MailGenerator.generate(email);

    const mailOptions = {
      from: '"KBS" <kingsbusinesssuite@gmail.com>',
      to: user.email,
      subject: '[KBS] Reset Password',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'Error sending email' });
      }
      console.log(`Email sent: ${info.response}`);
      return;
    });
  });
}

