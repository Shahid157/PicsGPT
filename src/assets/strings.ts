interface StringProps {
  signin: string;
  signup: string;
  verification: string;
  verificationNote: string;
  signInWithGoogle: string;
  signInWithDiscord: string;
  signUpWithGoogle: string;
  emailMagicLink: string;
  password: string;
  confirmPassword: string;
  email: string;
  rememberMe: string;
  forgotPassword: string;
  emailRequired: string;
  invalidEmail: string;
  passwordRequired: string;
  confirmPasswordRequired: string;
  passwordDoesNotMatch: string;
  passwordMustBeStrong: String;
  valid: string;
  noAccount: string;
  singupText: string;
  haveAccount: string;
  usewith: string;
  PrivacyPolicy: string;
  signinText: string;
  verifyNote: string;
  access_photo: string;
  access: string;
  skip: string;
  noGenerationText: string;
  dismiss: string;
  letstyle: string;
}

const strings: StringProps = {
  signin: 'Sign In',
  signup: 'Sign Up',
  usewith: 'use with',
  verification: 'Send Verification Code',
  verificationNote:
    'I authorize Styley to send me SMS to recieve about my result, account & specials',
  verifyNote: 'By entering your phone number, you authorize us to send you SMS',
  signInWithGoogle: 'Sign in with Google',
  signInWithDiscord: 'Sign in with Discord',
  emailMagicLink: 'Email - Magic link',
  password: 'Password',
  rememberMe: 'Remember me',
  forgotPassword: 'Forgot password?',
  email: 'Email',
  confirmPassword: 'Confirm password',
  signUpWithGoogle: 'Sign up with Google',
  emailRequired: 'Email required',
  invalidEmail: 'Invalid Email',
  valid: 'VALID',
  dismiss: 'Dismiss',
  letstyle: "Let's Styley",
  passwordRequired: 'Password required',
  passwordDoesNotMatch: 'Password does not match',
  confirmPasswordRequired: 'Confirm password required',
  passwordMustBeStrong: 'Password Must be strong',
  noAccount: " Don't have an Account ?",
  singupText: 'Singup here',
  haveAccount: 'Already have an account ?',
  signinText: 'Singin here',
  PrivacyPolicy: 'Terms of Use and Privacy Policy',
  access: 'Allow Access',
  access_photo: 'Allow access to photos',
  skip: 'Skip',
  noGenerationText: 'You have no generations',
};

export default strings;
