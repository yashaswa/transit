import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

// --------- Zod Schemas ----------
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string(),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  passport: z.string().optional(),
});

const verifyUserSchema = z.object({
  identifier: z.string(),
  verificationCode: z.string().min(4).max(6),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional().refine(val => val === undefined || !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  passport: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  resetToken: z.string(),
  newPassword: z.string().min(8),
});

const paymentMethodSchema = z.object({
  cardHolder: z.string(),
  cardType: z.string(), // could be refined to enum values
  last4: z.string().length(4),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(new Date().getFullYear()),
  token: z.string().optional(),
  userId: z.string(),
});

const familyMemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  gender: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  passport: z.string().optional(),
});

// --------- Helper Functions ----------

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// For simplicity, generate a dummy reset token (in production, use a secure random generator)
const generateResetToken = () => Math.random().toString(36).substring(2, 8);

// --------- Endpoints ----------

// 1. Create User (Registration)
router.post('/api/users', async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        phoneNumber: validatedData.phoneNumber,
        gender: validatedData.gender,
        dob: new Date(validatedData.dob),
        passport: validatedData.passport,
      },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: 'Error creating user' });
    }
  }
});

// 2. Verify User
router.post('/api/users/verify', async (req: Request, res: Response) => {
  try {
    const validatedData = verifyUserSchema.parse(req.body);
    // Implement verification logic here
    res.status(200).json({ message: 'User verified successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.errors || 'Error verifying user' });
  }
});

// 3. Update User Information (e.g. update name)
router.put('/api/users/:id', async (req: Request, res: Response) => {
  const parseResult = updateUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.errors });
  }
  const { id } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...parseResult.data, updatedAt: new Date() }
    });
    return res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: 'User not found' });
  }
});

// 4. Forgot Password
router.post('/api/users/forgot-password', async (req: Request, res: Response) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    // Implement password reset logic here
    res.status(200).json({ message: 'Password reset instructions sent' });
  } catch (error) {
    res.status(400).json({ error: error.errors || 'Error initiating password reset' });
  }
});

// 5. Reset Password
router.post('/api/users/reset-password', async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    // Implement password reset logic here
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.errors || 'Error resetting password' });
  }
});

// 6. Save Payment Information
router.post('/api/payment-methods', async (req: Request, res: Response) => {
  const parseResult = paymentMethodSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.errors });
  }
  const paymentData = parseResult.data;
  try {
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        ...paymentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    return res.status(201).json({ message: 'Payment method saved', paymentMethodId: paymentMethod.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error saving payment method' });
  }
});

// 7. Add Family Member
router.post('/api/family-members', async (req: Request, res: Response) => {
  const parseResult = familyMemberSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.errors });
  }
  const familyMemberData = parseResult.data;
  try {
    const familyMember = await prisma.familyMember.create({
      data: {
        ...familyMemberData,
        dob: new Date(familyMemberData.dob),
      }
    });
    return res.status(201).json({ message: 'Family member added', familyMemberId: familyMember.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error adding family member' });
  }
});

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default router;
