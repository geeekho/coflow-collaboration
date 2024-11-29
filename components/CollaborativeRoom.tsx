"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveCollaborators from "./ActiveCollaborators";
import ShareModal from "./modals/ShareModal";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/actions/room.actions";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  const contanierRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);
          if (updatedDocument) setEditing(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = async (e: MouseEvent) => {
      if (
        editing &&
        contanierRef.current &&
        !contanierRef.current.contains(e.target as Node)
      ) {
        setLoading(true);
        try {
          await updateDocument(roomId, documentTitle);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
          setEditing(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [documentTitle, roomId, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={contanierRef}
              className="flex w-fit flex-1 items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <Input
                  type="text"
                  ref={inputRef}
                  disabled={!editing}
                  defaultValue={documentTitle}
                  placeholder="Enter document title..."
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}
              {currentUserType === "editor" && !editing && (
                <Image
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="cursor-pointer"
                />
              )}
              {currentUserType !== "editor" && !editing && (
                <span className="view-only-tag">View only</span>
              )}
              {loading && (
                <span className="text-sm text-gray-400">saving...</span>
              )}
            </div>
            <div className="flex justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />
              {currentUserType === "editor" && (
                <ShareModal
                  roomId={roomId}
                  collaborators={users}
                  creatorId={roomMetadata.creatorId}
                  currentUserType={currentUserType}
                />
              )}
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
