"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import {db} from "@/lib/prisma"

export async function getOrganization(slug) {
    const { userId } = auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    console.log(userId);
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
  
    // Get the organization details
    const organization = await clerkClient().organizations.getOrganization({
      slug,
    });
  
    if (!organization) {
      return null;
    }
  
    const { data: membership } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: organization.id,
      });
  
    const userMembership = membership.find(
      (member) => member.publicUserData.userId === userId
    );
  
    // If user is not a member, return null
    if (!userMembership) {
      return null;
    }
  
    return organization;
  }

export async function getOrganizationUsers(orgId){
    const {userId} = auth();
    if(!userId){
        throw new Error("Unauthorized");
    }
    const user = await db.user.findUnique({
        where:{clerkUserId:userId}
    })

    if(!user){
        throw new Error("User not found");
    }

    const organizationMembership = await clerkClient.organizations.getOrganizationMembershipList({
        organizationId:orgId
    })

    const userIds = organizationMembership.data.map((membership)=> membership.publicUserData.userId)

    const users = await db.user.findMany({
        where:{clerkUserId:{
            in:userIds
        }}
    }) 
    console.log({'Users':users})
    return users;
}