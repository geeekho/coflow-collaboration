"use server";
import liveBlocks from "@/lib/liveblocks";
import { getAccessType, parseStringify } from "@/lib/utils";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

export const getDocuments = async (userId: string) => {
  try {
    const rooms = await liveBlocks.getRooms({
      userId,
    });
    return parseStringify(rooms);
  } catch (error) {
    console.log(`error happened while fetcing rooms: \n ${error}`);
  }
};

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  try {
    const roomId = nanoid();
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };
    const room = await liveBlocks.createRoom(roomId, {
      defaultAccesses: [],
      metadata,
      usersAccesses,
    });
    revalidatePath("/");
    return parseStringify(room);
  } catch (e) {
    console.log(`something happened while creating a room: ${e}`);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveBlocks.getRoom(roomId);
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    if (!hasAccess) {
      throw new Error("you do not have access to this document");
    }
    return parseStringify(room);
  } catch (error) {
    console.log(`error happened while getting the room ${roomId}: \n ${error}`);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveBlocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`document update error ${error}`);
  }
};

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const usersAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };
    const updatedRoom = await liveBlocks.updateRoom(roomId, {
      usersAccesses,
    });
    if (updatedRoom) {
      const notificationId = nanoid();
      await liveBlocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `you have been granrted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      });
    }
    revalidatePath(`/document/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`error updating room access: ${error}`);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveBlocks.getRoom(roomId);
    if (room && room.metadata.email === email) {
      throw new Error("you cannot remove yourself from the document");
    }
    const updatedRoom = await liveBlocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });
    revalidatePath(`/document/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`error removing collaborator ${error}`);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveBlocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/", RedirectType.replace);
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`);
  }
};
