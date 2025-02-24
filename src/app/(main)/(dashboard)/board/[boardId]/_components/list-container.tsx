"use client";

import { Board, List } from "@prisma/client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";

interface ListContainerProps {
  boardId: Board["id"];
  data: ListWithCards[];
}

const ListContainer = ({ boardId, data }: ListContainerProps) => {
  return (
    <ol>
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};

export { ListContainer };
