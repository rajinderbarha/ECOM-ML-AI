import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/utils/mongoDb"; // MongoDB connection utility
import User from "@/models/User"; // Your user schema/model

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', 
  },
  callbacks: {
    // Runs when a user signs in
    async signIn({ user }) {
      await connectToDatabase(); // Ensure MongoDB connection is established

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // If user doesn't exist, create a new one
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          preferences: [],
          searchHistory: [],
          familyMembers: 1,
          cart: [],
          orderHistory: [],
        });
      }
      return true; // Allow sign-in
    },

    // Include user details in the session
    async session({ session, token }) {
      await connectToDatabase();

      const dbUser = await User.findOne({ email: token.email });
      if (dbUser) {
        // Merge database user data with the session
        session.user = {
          id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image,
        //   preferences: dbUser.preferences,
        //   searchHistory: dbUser.searchHistory,
        };
      }
      return session;
    },

    // Modify the JWT token (e.g., include user email)
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
});
