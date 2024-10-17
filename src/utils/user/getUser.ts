import prisma from "@/lib/prisma";

// Find user by email
export const getUserByEmail = async (email: string, password?: string) => {
  return await prisma.user.findUnique({
    where: { email },
    cacheStrategy: {
      ttl: 60, // Cache user for 60 seconds
      swr: 120, // Revalidate user after 120 seconds
    }
  });
};

// Find user by id
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    cacheStrategy: {
      ttl: 30, // Cache user for 30 seconds
      swr: 60 // Serve stale data for 60 seconds
    }
  });
};

// Find user by email, first and last name
export const getUserByEmailWithNames = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Find user by id and plan
export const getUserByIdWithPlan = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { Plan: true },
    cacheStrategy: {
      ttl: 30, // Cache user for 30 seconds
      swr: 120 // Serve stale data for 120 seconds
    }
  });
};

// Find user by verification OTP
export const getUserByVerificationOTP = async (otp: string) => {
  const verificationOTP = await prisma.verificationOTP.findFirst({
    where: { otp },
    include: { user: true }, // Include associated user
  });

  if (!verificationOTP?.user) {
    return null; // Return null if OTP is invalid or user not found
  }

  return {
    user: verificationOTP.user, // Return the user and OTP details
    verificationOTP,
  };
};

// Find user by reset password token
export const getUserByResetPasswordToken = async (token: string) => {
  const passwordResetToken = await prisma.passwordResetToken.findFirst({
    where: { token },
    include: { user: true },
  });

  return passwordResetToken?.user || null; // Return user or null if not found
};
