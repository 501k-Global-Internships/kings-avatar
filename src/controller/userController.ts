import { Request, Response } from "express";
import passwordHash from 'password-hash';
import { v4 as uuidv4 } from 'uuid';
import User from "../models/user";
import {
  signJsonWebToken,
  getErrorMessage,
  forgotPasswordEmail,
  resetPasswordEmail,
  signUpEmail,
  signInEmail,
  changePasswordEmail
} from "../utils/utils";

class UserController {
  signUp(req: Request, res: Response) {
    User.create({
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
    }).then((usr) => {
      res.status(201).send({
        id: usr.id,
        email: usr.email,
        message: 'User created successfully',
        token: signJsonWebToken(usr),
      });

      signUpEmail(usr)
        .then(() => console.log('Sign-up email sent successfully'))
        .catch((error) => console.error('Error sending sign-up email:', error));
    }).catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({
          message: `A user with the email '${req.body.email}' already exists`,
        });
      }

      res.status(400).send({
        message: 'An error occurred while trying to sign up. Please try again',
      });
    });
  }

  signIn(req: Request, res: Response) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((usr) => {
      if (usr === null) {
        return res.status(404).send({ message: 'User not found' });
      }

      if (passwordHash.verify(req.body.password, usr.password)) {
        res.status(201).send({
          id: usr.id,
          email: usr.email,
          message: 'Sign in successful',
          token: signJsonWebToken(usr),
        });

        signInEmail(usr)
          .then(() => console.log('Sign-in email sent successfully'))
          .catch((error) => console.error('Error sending sign-in email:', error));
      } else {
        res.status(400).send({ message: 'Incorrect password' });
      }
    }).catch((error) => {
      res.status(401).send(getErrorMessage(error));
    });
  }

  authSignIn(req: Request, res: Response) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((usr) => {
      if (usr) {
        res.status(201).json({
          id: usr.id,
          email: usr.email,
          message: 'Sign in successful',
          token: signJsonWebToken(usr),
        });

        signInEmail(usr)
          .then(() => console.log('Sign-in email sent successfully'))
          .catch((error) => console.error('Error sending sign-in email:', error));
      } else {
        return User.create({
          email: req.body.email,
        }).then((createdUser) => {
          const token = signJsonWebToken(createdUser);
          res.status(201).json({
            id: createdUser.id,
            email: createdUser.email,
            message: 'User created and signed in successfully',
            token: signJsonWebToken(createdUser),
          });

          signUpEmail(createdUser)
            .then(() => console.log('Sign-up email sent successfully'))
            .catch((error) => console.error('Error sending sign-up email:', error));
        }).catch((error) => {
          console.error('Error creating user:', error);
          return res.status(400).json({
            message: 'An error occurred while trying to sign up. Please try again',
          });
        });
      }
    })
      .catch((error) => {
        console.error('Error finding user:', error);
        return res.status(401).json({
          error: getErrorMessage(error),
        });
      });
  }

  changePassword(req: Request, res: Response) {
    User.findOne({
      where: {
        id: (req as any).user.id,
      },
    }).then((usr) => {
      if (!usr) {
        throw new Error('user not found');
      }

      if (passwordHash.verify(req.body.currentPassword, usr.password)) {
        if (req.body.currentPassword === req.body.newPassword) {
          return res.status(400).send({
            message: "New password can't be the same as current password",
          });
        }
        User.update({ passwordHash: passwordHash.generate(req.body.newPassword) },
          { where: { id: (req as any).user.id } },
        ).then((changedPassword) => {
          if (changedPassword) {
            res.status(200).send({
              message: 'Password changed successfully',
            });

            changePasswordEmail(usr)
              .then((response) => res.status(200).send(response))
              .then(() => console.log('Change password email sent successfully'))
              .catch((error) => console.error('Error sending Change password email:', error));
          }
        });
      } else {
        return res.status(400).send({
          message: 'Current password is incorrect',
        });
      }
    });
  }

  checkPasswordSet(req: Request, res: Response) {
    User.findOne({
      where: {
        id: (req as any).user.id,
      },
    }).then((usr) => {
      if (usr && usr.password) {
        return res.status(200).json({ isPasswordSet: true });
      } else {
        return res.status(200).json({ isPasswordSet: false });
      }
    }).catch((error) => {
      console.error('Error checking password set:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }

  forgotPassword(req: Request, res: Response) {
    const newUuid = uuidv4();
    User.update({
      recoveryPasswordId: newUuid
    },
      { where: { email: req.body.email }, returning: true },
    ).then((updated) => {
      const user = updated[1][0]
      if (user) {
        forgotPasswordEmail(user)
          .then(() => {
            res.status(201).send({
              message: 'Reset password email sent successfully',
            });
          }).catch((error) => console.error('Error sending reset password email:', error));

        return;
      }
    });
  }

  resetPassword(req: Request, res: Response) {
    const { recoveryPasswordId } = req.query;

    User.findOne({
      where: {
        recoveryPasswordId,
      },
    }).then((usr) => {
      if (usr) {
        User.update(
          {
            passwordHash: passwordHash.generate(req.body.newPassword),
            recoveryPasswordId: null,
          },
          {
            where: {
              id: usr.id,
            },
          },
        ).then((updatedPassword) => {
          if (updatedPassword) {
            res.status(200).send({
              message: 'Your new Password has been created successfully',
            });

            resetPasswordEmail(usr)
              .then(() => console.log('Password reset success email sent successfully'))
              .catch((error) => console.error('Error sending password reset success email:', error))
          }
        });
      } else {
        res.status(404).send({ message: 'Invalid or expired password reset link. Please request a new password reset.' });
      }
    });
  }
}

export default new UserController();