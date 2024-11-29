import liveBlocks from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST() {
  // Get the current user from your database
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  const { id, fullName, emailAddresses, imageUrl } = clerkUser;

  // Get the current user from your database
  const user = {
    id,
    info: {
      id,
      name: `${fullName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  };

  // Identify the user and return the result
  const { status, body, error } = await liveBlocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info },
  );
  console.log("error");
  console.log(error);
  console.log("status");
  console.log(status);

  return new Response(body, { status });
}
