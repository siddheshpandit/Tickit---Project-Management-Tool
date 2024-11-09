import { getOrganizationUsers } from "@/actions/organization";
import { createIssue } from "@/actions/issues";
import { issueSchema } from "@/app/lib/validators";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useFetch from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateIssue = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const {
    data: users,
    loading: usersLoading,
    error,
    fn: fetchUsersFn,
  } = useFetch(getOrganizationUsers);

  const {
    data: newIssue,
    loading: createIssueLoading,
    fn: createIssueFn,
  } = useFetch(createIssue);

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsersFn(orgId);
    }
  }, [orgId, isOpen]);

  useEffect(()=>{
    if(newIssue){
        reset();
        onClose();
        onIssueCreated();
        toast.success("Issue Created Successfully")
    }
  },[newIssue,createIssueLoading])
  const submitForm = async (data) => {
    createIssueFn(projectId,{
        ...data,status,sprintId
    });
    
  };
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new Issue</DrawerTitle>
        </DrawerHeader>
        {usersLoading && <BarLoader color="#36d7b7" width={"100%"} />}
        <form onSubmit={handleSubmit(submitForm)} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigneeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assigneeId.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {error && <p className="text-red-500 mt-2">{error.message}</p>}
          <Button disabled={createIssueLoading} type="submit" className="w-full">{createIssueLoading?'Creating':'Create Issue'}</Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateIssue;
