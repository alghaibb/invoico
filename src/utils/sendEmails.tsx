import prisma from "@/lib/prisma";
import { VerifyEmail, ForgotPassword } from "@/components/emails";
import { Resend } from "resend";
import { getUserById } from "./getUser";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send verification email
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  verificationCode: string
) => {
  // Get users name from database
  const user = await prisma.user.findFirst({
    where: { email },
    select: { firstName: true },
  });

  const userFirstName = user?.firstName || firstName;

  await resend.emails.send({
    from: "no-reply@codewithmj.com",
    to: email,
    subject: "Verify your email address",
    react: (
      <VerifyEmail
        verificationCode={verificationCode}
        firstName={userFirstName}
      />
    ),
  });
};

// Send forgot password email
export const sendForgotPasswordEmail = async (
  email: string,
  firstName: string,
  resetPasswordToken: string
) => {
  // Get users name from database
  const user = await getUserById(email);

  const userFirstName = user?.firstName || firstName;

  const resetPasswordLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetPasswordToken}`;

  await resend.emails.send({
    from: "no-reply@codewithmj.com",
    to: email,
    subject: "Reset your password",
    react: (
      <ForgotPassword
        firstName={userFirstName}
        resetPasswordLink={resetPasswordLink}
      />
    ),
  });
};
