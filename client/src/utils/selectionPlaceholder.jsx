import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export const SelectionPlaceholder = ({ message }) => (
  <div className="flex flex-col w-full items-center justify-center h-full">
    <div className="flex items-center gap-1 p-6">
      <InformationCircleIcon className="w-12 h-12 text-emerald-500" />
      <p className="text-xl text-emerald-500 font-medium">{message}</p>
    </div>
  </div>
);