import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

// if (!process.env.GOOGLE_CLIENT_ID){
//     throw 'google client ID is missing';
// }

export const authOptions = {
    secret: process.env.SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
};

const handler = NextAuth(authOptions);


export { handler as GET, handler as POST }