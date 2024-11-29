import { getDocuments } from "@/actions/room.actions";
import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { DeleteModal } from "@/components/modals/DeleteModal";
import Notifications from "@/components/Notifications";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { RoomData } from "@liveblocks/node";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const documents = await getDocuments(user.emailAddresses[0].emailAddress);

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {documents.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold capitalize">all documents</h3>
            <AddDocumentBtn
              userId={user!.id}
              email={user!.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {documents.data.map((document: RoomData) => (
              <li key={document.id} className="document-list-item">
                <Link
                  href={`/documents/${document.id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image
                      src={"/assets/icons/doc.svg"}
                      alt={`${document.metadata.title} document`}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="line-clamp-1 text-lg">
                      {document.metadata.title}
                    </span>
                    <span className="text-sm font-light text-blue-100">
                      Created about {dateConverter(document.createdAt)}
                    </span>
                  </div>
                </Link>
                {document.metadata.email ===
                user.emailAddresses[0].emailAddress ? (
                  <DeleteModal roomId={document.id} />
                ) : (
                  <span className="pl-2 text-xs font-normal text-blue-100">
                    shared with you
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src={"/assets/icons/doc.svg"}
            alt="empty-list-icon"
            className="mx-auto"
            width={40}
            height={40}
          />
          <AddDocumentBtn
            userId={user!.id}
            email={user!.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default page;
