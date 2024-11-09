"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import UserAvatar from "./user-avatar";
import { formatDistanceToNow } from "date-fns";
import IssueDialogDetails from './issue-details-dialog';
import { useRouter } from "next/navigation";
const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-600",
  HIGH: "border-orange-600",
  URGENT: "border-red-600",
};
const IssueCard = ({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler=(...params)=>{
    router.refresh();
    onDelete(...params)
  }

  const onUpdateHandler=(...params)=>{
    router.refresh();
    onUpdate(...params);
  }
  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });
  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}
        >
          <CardTitle>{issue.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant={"outline"} className="-mt-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />
          <div className="text-xs text-gray-400 w-full">{created}</div>
        </CardFooter>
      </Card>
      {isDialogOpen && (
        <IssueDialogDetails
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
};

export default IssueCard;
