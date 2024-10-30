import {currentUser} from '@clerk/nextjs/server'
import { db } from './prisma';
export const checkUser = async()=>{
    const user = await currentUser();
    console.log({ClerkData: user});
    if(!user){
        return null;
    }
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId:user.id ,
              },
        })
        if(loggedInUser){
            return loggedInUser;
        }
        const name = `${user.firstName} ${user.lastName}`;
        const userDetails = {
            clerkUserId:user.id,
            name:name,
            email:user.emailAddresses[0].emailAddress,
            imageUrl:user.imageUrl,
        }
        const newUser = await prisma.user.create({
            data: userDetails,
          })
        return newUser;
    } catch (error) {
        console.log(error);
    }
}