"use client";

import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import UserTypeSelector from "../UserTypeSelector";
import Collaborator from "../Collaborator";
import { updateDocumentAccess } from "@/actions/room.actions";

const ShareModal = ({
  collaborators,
  creatorId,
  currentUserType,
  roomId,
}: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");

  const shareDocumentHandler = async () => {
    setLoading(true);
    await updateDocumentAccess({
      roomId,
      email,
      userType,
      updatedBy: user.info,
    });
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="gradient-blue flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2"
        disabled={currentUserType !== "editor"}
      >
        <Image
          src={"/assets/icons/share.svg"}
          alt="share"
          width={20}
          height={20}
          className="min-w-4 md:size-5"
        />
        <span className="mr-1 hidden sm:block">Share</span>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Manage who can view this document</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="collaborator@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type="submit"
            disabled={loading}
            onClick={shareDocumentHandler}
            className="gradient-blue flex h-full gap-1 px-5"
          >
            {loading ? "Sending..." : "Invite"}
          </Button>
        </div>
        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                email={collaborator.email}
                creatorId={creatorId}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
