import { db } from "@/app/lib/db"
import * as bcrypt from 'bcrypt-ts';

export const createUserByEmail = async (email: string, password: string, name: string, image: string, role: string) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        image,
        role
      }
    });

    return user;
  } catch (error) {
    // Handle error
    console.error('Error creating user:', error);
    throw error;
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    })

    return user;
  } catch (error) {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id
      }
    })

    return user;
  } catch (error) {
    return null
  }
}

export const getAccountByUserId = async (userId: string) => {
    try {
      const account = await db.account.findFirst({
        where: { userId: userId }
      })
      return account
    } catch (error) {
      return null
    }
}