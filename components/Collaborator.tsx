"use client";

import Image from "next/image";
import { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import {
  removeCollaborator,
  updateDocumentAccess,
} from "@/actions/room.actions";

const Collaborator = ({
  collaborator,
  creatorId,
  email,
  roomId,
  user,
}: CollaboratorProps) => {
  const [userType, setUserType] = useState<UserType>(
    collaborator.userType || "viewer",
  );
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async (type: UserType) => {
    setLoading(true);
    await updateDocumentAccess({
      roomId,
      email,
      userType: type,
      updatedBy: user,
    });
    setLoading(false);
  };
  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);
    await removeCollaborator({ roomId, email });
    setLoading(false);
  };

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}

            {loading && (
              <span className="text-10-regular pl-2 text-blue-100">
                Saving...{" "}
              </span>
            )}
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>
      {creatorId === collaborator.id ? (
        <p className="text-sm text-blue-100">Owner</p>
      ) : (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType}
            setUserType={setUserType}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            disabled={loading}
            type="button"
            onClick={() => removeCollaboratorHandler(collaborator.email)}
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};

export default Collaborator;
