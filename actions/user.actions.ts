"use server";

import liveBlocks from "@/lib/liveblocks";
import { parseStringify } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";

export const getUsers = async (userIds: string[]) => {
  try {
    const { data } = await (
      await clerkClient()
    ).users.getUserList({
      emailAddress: userIds,
    });
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.fullName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));
    const sortedUsers = userIds.map((email) =>
      users.find((x) => x.email === email),
    );
    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`error fetching users: ${error}`);
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveBlocks.getRoom(roomId);
    if (room) {
      const users = Object.keys(room.usersAccesses).filter(
        (email) => email !== currentUser,
      );
      if (text.length) {
        const lowerCaseText = text.toLowerCase();
        const filteredUsers = users.filter((email) =>
          email.toLowerCase().includes(lowerCaseText),
        );
        return parseStringify(filteredUsers);
      }
      return parseStringify(users);
    }
    return parseStringify([]);
  } catch (error) {
    console.log(`error fetching document users: ${error}`);
  }
};
