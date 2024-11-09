"use client";

import React, { useEffect, useState } from "react";
import SprintManager from "../_components/sprintManager";
import CreateIssue from "../_components/createIssue";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import IssueCard from "@/components/issue-card";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import BoardFilters from './boardFilters';

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
const sprintBoard = ({ sprints, projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const {
    data: issues,
    loading: issuesLoading,
    error: issuesError,
    fn: getIssuesFn,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);
  const [filteredIssues, setFilteredIssues] = useState(issues);

  const handleFilterChange = (newFilteredIssues)=>{
    console.log(newFilteredIssues);
    setFilteredIssues(newFilteredIssues);
  }
  useEffect(() => {
    if (currentSprint.id) {
      getIssuesFn(currentSprint.id);
    }
  }, [currentSprint.id]);
  const handleIssueCreated = () => {
    // fetch issues
    getIssuesFn(currentSprint.id);
  };

  const {
    error: updateIssueError,
    loading: updateIssueLoading,
    fn: updateIssueOrderFn,
  } = useFetch(updateIssueOrder);
  const onDragEnd = (result) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the Sprint to update board.");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update the board after sprint end");
      return;
    }

    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newOrderedData = [...issues];
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );
    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    // Cases
    // 1. Source and Destination in Same column
    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );
      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    }

    // 2. Source and Destination in different columns
    else {
      // remove source card from source list
      const [removedCard] = sourceList.splice(source.index, 1);
      removedCard.status = destination.droppableId;
      // add card to destination list
      destinationList.splice(destination.index, 0, removedCard);
      // reorder lists
      sourceList.forEach((card, i) => {
        card.order = i;
      });
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }
    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };
  if (issuesError) {
    return <div>Error loading Issues. Please Refresh</div>;
  }
  return (
    <div>
      {/*Sprint manager  */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      {issues && !issuesLoading && (
        <BoardFilters issues={issues} onFilterChange = {handleFilterChange}/>
      )} 
      {updateIssueError && (
        <p className="text-red-500 mt-2">{updateIssueError.message}</p>
      )}

      {(updateIssueLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((status) => (
            <Droppable key={status.key} droppableId={status.key}>
              {(provided) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <h1 className="font-semibold mb-2 text-center">
                      {status.name}
                    </h1>

                    {/* Issues */}
                    {filteredIssues
                      ?.filter((issue) => issue.status === status.key)
                      .map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                          isDragDisabled={updateIssueLoading}
                        >
                          {(provided) => {
                            return (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="space-y-2"
                              >
                                <IssueCard
                                  issue={issue}
                                  showStatus={true}
                                  onDelete={() => getIssuesFn(currentSprint.id)}
                                  onUpdate={(updatedIssue) =>
                                    setIssues((issues) =>
                                      issues.map((issue) => {
                                        if (issue.id === updatedIssue.id)
                                          return updatedIssue;
                                        return issue;  
                                      })
                                    )
                                  }
                                />
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    {status.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          onClick={() => handleAddIssue(status.key)}
                          variant="ghost"
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Create Issue
                        </Button>
                      )}
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <CreateIssue
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default sprintBoard;
