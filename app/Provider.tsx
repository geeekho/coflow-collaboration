"use client";
import Loader from "@/components/Loader";
import { getDocumentUsers, getUsers } from "@/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUser();
  const resolveUsers = async ({ userIds }: { userIds: string[] }) => {
    const users = await getUsers(userIds);
    return users;
  };
  const resolveMentionSuggestions = async ({
    text,
    roomId,
  }: {
    text: string;
    roomId: string;
  }) => {
    const users = await getDocumentUsers({
      roomId,
      currentUser: user?.emailAddresses[0].emailAddress ?? "",
      text,
    });
    return users;
  };

  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth"}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
