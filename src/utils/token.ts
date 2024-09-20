import prisma from "@/lib/prisma";
import crypto, { randomInt } from "crypto";
import { getUserByEmail } from "./user/getUser";
import { error } from "console";

// -------------------- OTP GENERATION FUNCTIONS --------------------

// Function to generate 6-digit numeric OTP
const generateOtp = () => {
  const otp = randomInt(100000, 999999);
  return otp.toString();
};

// Generate verification code and store it in the database
export const generateVerificationCode = async (email: string) => {
  const verificationCode = generateOtp();

  // Get user by email
  const user = await getUserByEmail(email);

  // Check if user exists before accessing the id property
  if (user) {
    // Store verification code in the database
    await prisma.verificationOTP.create({
      data: {
        otp: verificationCode,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
      },
    });
  } else {
    console.error("User not found");
  }

  return verificationCode;
};

// -------------------- OTP VERIFICATION AND DELETION FUNCTIONS --------------------

// Delete verification code from the database
export const deleteVerificationCode = async (otp: string) => {
  // First, find the record by the OTP field
  const otpRecord = await prisma.verificationOTP.findFirst({
    where: { otp },
  });

  if (!otpRecord) {
    console.log("OTP not found. Nothing to delete.");
    return; // Exit if no OTP found
  }

  // Delete the record by the unique `id` field
  await prisma.verificationOTP.delete({
    where: { id: otpRecord.id }, // Use the unique id to delete
  });
};

// Verify the verification code and ensure it matches the user's email
export const verifyVerificationCode = async (otp: string, email: string) => {
  const verificationOTP = await prisma.verificationOTP.findFirst({
    where: { otp, user: { email } }, // Ensure the OTP matches the provided email
    include: { user: true },
  });

  if (!verificationOTP) {
    return { user: null, error: "Invalid OTP or email address" }; // OTP or email mismatch
  }

  if (verificationOTP.expiresAt <= new Date()) {
    // OTP has expired
    return { user: null, error: "OTP has expired. Please request a new one." };
  }

  // OTP is valid and not expired
  return { user: verificationOTP.user, error: null };
};


// -------------------- RESET PASSWORD FUNCTIONS --------------------

// Generate reset password token and store it in the database
export const generateResetPasswordToken = async (email: string) => {
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");

  // Get user by email
  const user = await getUserByEmail(email);

  // Check if user exists before accessing the id property
  if (user) {
    // Store reset password token in the database
    await prisma.passwordResetToken.create({
      data: {
        token: resetPasswordToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
      },
    });
  } else {
    console.error("User not found");
  }

  return resetPasswordToken;
};

// Delete reset password token from the database
export const deleteResetPasswordToken = async (token: string) => {
  // Find the record by the token field
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { token },
  });

  // If the token does not exist, return early
  if (!existingToken) {
    console.log("Token not found. Nothing to delete.");
    return;
  }

  // Delete the record by the unique `id` field
  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id }, // Use the unique id to delete
  });
};

// Verify the reset password token
export const verifyResetPasswordToken = async (token: string) => {
  const passwordReset = await prisma.passwordResetToken.findFirst({
    where: { token },
    include: { user: true },
  });

  if (passwordReset && passwordReset.expiresAt > new Date()) {
    return passwordReset.user;
  } else {
    return null;
  }
};
