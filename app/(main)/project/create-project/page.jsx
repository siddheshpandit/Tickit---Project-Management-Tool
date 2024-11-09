"use client";
import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../../lib/validators";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {createProject} from '@/actions/projects';
import useFetch from '@/hooks/useFetch';
import { toast } from "sonner";
const CreateProjectPage = () => {
  const router = useRouter();
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });
  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {data:project,loading,error,fn:createProjectFn}=useFetch(createProject)

  useEffect(() => {
    if(project){
      toast.success("Project created successfully");
      router.push(`/project/${project.id}`);
    }
  }, [project])
  
  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }
  if (!isAdmin) {
    // router.push(`/organization/${organization.slug}`);
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins are allowed to create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  const onSubmit=async(data)=>{
    createProjectFn(data);
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="name"
          className="bg-slate-950"
          placeholder="Project Name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}

        <Input
          id="key"
          className="bg-slate-950"
          placeholder="Project Key"
          {...register("key")}
        />
        {errors.key && (
          <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
        )}
        <Textarea
          id="description"
          className="bg-slate-950"
          placeholder="Project Description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
        <Button type="submit" className="bg-blue-500 text-white" size={"lg"}>
          {loading?"Creating":'Create Project'}
        </Button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
};

export default CreateProjectPage;
