import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getUsers } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { RoomData } from "@liveblocks/node";
import { redirect } from "next/navigation";
import { getDocument } from "@/actions/room.actions";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const room: RoomData = await getDocument({
    roomId: id,
    userId: user.emailAddresses[0].emailAddress,
  });
  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  const users: User[] = await getUsers(userIds);

  const userData: User[] = users.map((user) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write" as never)
      ? "editor"
      : "viewer",
  }));

  const currentUserType = room.usersAccesses[
    user.emailAddresses[0].emailAddress
  ]?.includes("room:write" as never)
    ? "editor"
    : "viewer";
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={room.id}
        roomMetadata={room.metadata as RoomMetadata}
        users={userData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
