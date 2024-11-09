import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { deleteIssue, updateIssue } from "@/actions/issues";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import statuses from "../data/status.json";
import useFetch from "@/hooks/useFetch";
import MDEditor from "@uiw/react-md-editor";
import { Avatar } from "./ui/avatar";
import UserAvatar from "./user-avatar";
import { AlertDialog } from "./ui/alert-dialog";
import { AlertDialogContent } from "@radix-ui/react-alert-dialog";
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const IssueDialogDetails = ({
  isOpen,
  onClose,
  issue,
  onDelete,
  onUpdate,
  borderCol,
}) => {
  const [priority, setPriority] = useState(issue.priority);
  const [status, setStatus] = useState(issue.status);
  const { user } = useUser();
  const { membership } = useOrganization();

  const pathname = usePathname();
  const router = useRouter();

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updatedData,
  } = useFetch(updateIssue);

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleteData,
  } = useFetch(deleteIssue);

  const handleGotoProjectPage = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const isProjectPage = pathname.startsWith("/project/");

  const canChange =
    user.id === issue.reporterId || membership.role === "org:admin";
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
        deleteIssueFn(issue.id);
    }
  };
  const handleUpdate = () => {
    updateIssueFn(issue.id, { status: status, priority: priority });
  };

  useEffect(() => {
    if (deleteData) {
      onClose();
      onDelete();
    }
    if (updatedData) {
      onUpdate(updatedData);
    }
  }, [deleteData, updatedData, deleteLoading, updateLoading]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{issue.name}</DialogTitle>
            </div>
            {!isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGotoProjectPage}
                title="Go to Project"
              >
                <ExternalLink />
              </Button>
            )}
          </DialogHeader>
          {(updateLoading || deleteLoading) && (
            <BarLoader width={"100%"} color="#36d7b7" />
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={priority}
                onValueChange={(priority) => setPriority(priority)}
                disabled={!canChange}
              >
                <SelectTrigger className={`border ${borderCol} rounded`}>
                  <SelectValue placeholder="Priority"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h4 className="font-semibold">Description</h4>
              <MDEditor.Markdown
                className="rounded px-2 py-1"
                source={issue.description ? issue.description : "--"}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Assignee</h4>
                <UserAvatar user={issue.assignee} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Reporter</h4>
                <UserAvatar user={issue.reporter} />
              </div>
            </div>
            {canChange && (
              <div className="flex justify-between">
                <Button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  variant={"destructive"}
                >
                  {deleteLoading ? "Deleting..." : "Delete Issue"}
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={updateLoading}
                  variant={""}
                >
                  {updateLoading ? "Updating..." : "Update Issue"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IssueDialogDetails;
