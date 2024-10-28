/*import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authConfig } from "./authconfig"
import { connectToDB } from '../../app/lib/utils'
import { User } from '../../app/lib/models'
import bcrypt from 'bcrypt'

const login = async (credentials) => {
    try {
        connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('Informações de usuario incorretas!');

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error('Informações de usuario incorretas!');

        return user;


    } catch (err) {
        console.log(err);
        throw new Error('Falhou ao tentar logar')
    }
}

export const { signIn, signOut, auth } =  NextAuth({
    ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
            const user = await login(credentials);
            return user;
        } catch (err) {
            return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.name = user.name;
        token.id = user.id;
      }
      return token;
    },
    async session({session, token}) {
      if (token) {
        session.user.name = token.name;
        session.user.id = token.id;
      }
      return session;
    },
  }
})*/