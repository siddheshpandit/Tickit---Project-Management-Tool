"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export async function createIssue(projectId, data) {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  const lastIssue = await db.issues.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;
  const newData = {
    name: data.name,
    description: data.description,
    status: data.status,
    order: newOrder,
    priority: data.priority,
    projectId: projectId,
    sprintId: data.sprintId,
    reporterId: user.id,
    assigneeId: data.assigneeId || null,
  };
  const issue = await db.issues.create({
    data: newData,
    include: {
      assignee: true,
      reporter: true,
    },
  });
  return issue;
}


export async function getIssuesForSprint(sprintId){
    const {userId,orgId} = auth();
    if(!userId || !orgId){
        throw new Error("Unauthorized");
    }
    const issues = await db.issues.findMany({
        where:{sprintId:sprintId},
        orderBy:[{status:'asc'},{order:'asc'}],
        include:{
            assignee:true,
            reporter:true
        }
    })
    return issues;
}

export async function updateIssueOrder(updatedIssues){
    const {userId,orgId}= auth();
    if(!userId  || !orgId){
        throw new Error('Unauthorized');
    }
    await db.$transaction(async (prisma)=>{
        for(const issue of updatedIssues){
            await prisma.issues.update({
                where:{id:issue.id},
                data:{
                    status:issue.status,
                    order:issue.order
                }
            })
        }
    })
    return {success:true};
}


export async function deleteIssue(issueId) {
    const { userId, orgId } = auth();
  
    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const issue = await db.issues.findUnique({
      where: { id: issueId },
      include: { project: true },
    });
  
    if (!issue) {
      throw new Error("Issue not found");
    }
    console.log(issue.project.adminIds);
    if (
      issue.reporterId !== user.id &&
      !issue.project.adminIds.includes(user.id)
    ) {
      throw new Error("You don't have permission to delete this issue");
    }
  
    await db.issues.delete({ where: { id: issueId } });
  
    return { success: true };
  }

export async function updateIssue(issueId,updatedData){
    const {userId,orgId} = auth();
    if(!userId || !orgId){
        throw new Error("Unauthorized");
    }

    try{
        const issue = await db.issues.findUnique({
            where:{id:issueId},
            include:{project:true}
        })
        if(!issue){
            throw new Error("Issue not found");
        }
        if(issue.project.organizationId !== orgId){
            throw new Error("Unauthorized");
        }
        const updatedIssue = await db.issues.update({
            where:{id:issueId},
            data:{
                status:updatedData.status,
                priority:updatedData.priority,
            },
            include:{
                assignee:true,
                reporter:true
            }
        })
        return updatedIssue;
    }
    catch(error){
        throw new Error("Error updating issue: "+error.message);
    }
}

export async function getUserIssues(userId){
    const {orgId} = auth();
    if(!userId || !orgId){
        throw new Error("No UserId or Organization Id Found");
    }
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    
      if (!user) {
        throw new Error("User not found");
      }
    const issues = await db.issues.findMany({
        where:{
            OR:[{assigneeId:user.id},{reporterId:user.id}],
            project:{
                organizationId:orgId
            }
        },
        include:{
            project:true,
            assignee:true,
            reporter:true
        },
        orderBy:{updatedAt:"desc"}
    })

    return issues;
}