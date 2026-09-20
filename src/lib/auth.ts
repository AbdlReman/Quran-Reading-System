import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import dbConnect from './mongodb';
import User from '../models/User';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          await dbConnect();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            throw new Error('Invalid email or password');
          }

          if (!user.isActive) {
            throw new Error('Account is deactivated. Please contact support.');
          }

          if (user.isLocked()) {
            throw new Error('Account is temporarily locked due to too many failed login attempts. Please try again later.');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            // Increment failed login attempts
            await user.incrementLoginAttempts();
            throw new Error('Invalid email or password');
          }

          // Reset login attempts on successful login
          await user.resetLoginAttempts();

          return {
            id: (user._id as mongoose.Types.ObjectId).toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profileImage,
            isEmailVerified: user.isEmailVerified,
          };
        } catch (error: unknown) {
          console.error('Auth error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
          throw new Error(errorMessage);
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
