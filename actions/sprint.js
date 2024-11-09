"use server"
import {auth} from '@clerk/nextjs/server';
import {db} from '@/lib/prisma';
export async function createSprint(projectId,data){
    const {userId,orgId} = auth();

    if(!userId || !orgId){
        throw new Error("Unauthorized");
    }

    const project = await db.project.findUnique({
        where:{
            id:projectId
        }
    })
    if(!project || project.organizationId!==orgId){
        throw new Error('Project not found');
    }

    const sprint = await db.sprint.create({
        data:{
            name:data.name,
            startDate:data.startDate,
            endDate:data.endDate,
            status:'PLANNED',
            projectId
        }
    })

    return sprint;
}

export async function updateSprintStatus(sprintId,newStatus){
    const {userId,orgId,orgRole}= auth();
    // console.log(userId,orgId,orgRole);
    if(!userId || !orgId){
        throw new Error("Unauthorized");
    }
    if(orgRole!=="org:admin"){
        throw new Error("Only admins can make changes");
    }
    try {
        const sprint = await db.sprint.findUnique({
            where: { id: sprintId },
            include: { project: true },
        });
        if(!sprint){
            throw new Error("Sprint not found");
        }
        console.log(sprint)
        console.log(orgId);
        if(sprint.project.organizationId!==orgId){
            throw new Error("Unauthorized");
        }
        const now=new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);

        if(newStatus==='ACTIVE' && (now<startDate || now>endDate)){
            throw new Error("Cannot start sprint outside of its date range");
        }
        if(newStatus ==='COMPLETED' && sprint.status!=='ACTIVE'){
            throw new Error("Can only complete an active sprint");
        }

        const updatedSprint = await db.sprint.update({
            where:{id:sprintId},
            data:{status:newStatus}
        })

        return {success:true,sprint:updatedSprint};
    } catch (error) {
        console.log({Error:error})
        throw new Error(error.message);
    }
}