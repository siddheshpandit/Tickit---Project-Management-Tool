import React from 'react'
import { getProjects } from '@/actions/projects';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteProject from '../_components/DeleteProject'

const ProjectList = async ({orgId}) => {
    const projectList = await getProjects(orgId);
    if(projectList.length===0){
        return <p>
            No Projects Found. {" "}
            <Link href={"/project/create"}
            className='underline underline-offset-2 text-blue-200'
            />
        </p>
    }
    return (

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {projectList.map((project)=>(
            <Card key={project.id}>
                <CardHeader>
                    <CardTitle className='flex justify-between items-center'>{project.name}
                        <DeleteProject projectId={project.id}/>
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-gray-500 mb-4'>{project.description}</p>
                    <Link href={`/project/${project.id}`}
                    className='text-blue-500 hover:underline'
                    >View Project
                        </Link>
                </CardContent>
            </Card>
        ))}
    </div>
    )
}

export default ProjectList;