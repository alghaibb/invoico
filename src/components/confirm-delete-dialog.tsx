"use client";

import { FaTrash } from "react-icons/fa6";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
  triggerElement?: React.ReactNode;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  triggerElement,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerElement ? (
          triggerElement
        ) : (
          <Button variant="ghost">
            <FaTrash className="mr-1" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
