import { Router } from "express";
import UserController from "../controller/userController";
import {
  signUpConstraints,
  signInConstraints,
  validateFormData,
  validateToken,
  verifyAuthToken,
  changePasswordConstraints,
  emailConstraints,
  resetPasswordConstraints
} from "../middlewares/userValidate";
import userController from "../controller/userController";

const router = Router()

router.post('/sign-up', signUpConstraints, validateFormData, UserController.signUp);
router.post('/sign-in', signInConstraints, validateFormData, UserController.signIn);
router.post('/auth-sign-in', emailConstraints, validateFormData, userController.authSignIn);
router.put('/change-password', verifyAuthToken, validateToken, changePasswordConstraints, validateFormData, userController.changePassword);
router.get('/check-password-set', verifyAuthToken, validateToken, userController.checkPasswordSet);
router.patch('/forgot-password', emailConstraints, validateFormData, userController.forgotPassword);
router.put('/reset-password', resetPasswordConstraints, validateFormData, userController.resetPassword);

export default router;