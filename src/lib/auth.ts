import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // For prototype, any password works if user exists or we just create a mock user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) return user;

        // Auto-create user for development ease if password is 'password'
        if (credentials.password === 'password') {
          return await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: credentials.email.includes('admin') ? 'Admin' : 'Consumer',
            },
          });
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).customerId = token.customerId;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.customerId = (user as any).customerId;
      } else {
        // Fetch fresh data if needed
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.customerId = dbUser.customerId;
        }
      }
      return token;
    },
  },
};
