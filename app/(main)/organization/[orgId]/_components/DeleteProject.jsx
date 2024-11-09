"use client";
import React, { useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteProject } from "@/actions/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const DeleteProject = ({ projectId }) => {
  const { membership } = useOrganization();
  const router = useRouter();
  const {data:deleted,error,loading:isDeleting,fn:deleteProjectFn} = useFetch(deleteProject);
  const isAdmin = membership?.role === "org:admin";

  const handleDelete = ()=>{
    if(window.confirm("Are you sure you want to delete this project?")){
        deleteProjectFn(projectId);
    }
  }

  useEffect(() => {
    if(deleted?.success){
        toast.success("Project Deleted Successfully")
        router.refresh();
    }
    return () => {
    }
  }, [deleted])
  
  if (!isAdmin) return null;
  return (
    <>
      <Button variant={"ghost"} size={'sm'} className={`${isDeleting?"animate-pulse":""}`} onClick={handleDelete} disabled={isDeleting}>
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
};

export default DeleteProject;
