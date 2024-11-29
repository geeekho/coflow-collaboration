"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RoomData } from "@liveblocks/node";
import { createDocument } from "@/actions/room.actions";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const addDocumentHandler = async () => {
    setLoading(true);
    try {
      const room: RoomData = await createDocument({ userId, email });
      if (room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      type="submit"
      className="gradient-blue flex gap-1 shadow-md"
      onClick={addDocumentHandler}
      disabled={loading}
    >
      <Image
        src={"/assets/icons/add.svg"}
        alt="add document"
        width={24}
        height={24}
      />
      <p className="hidden capitalize sm:block">
        {loading ? "creating document..." : "start a blank document"}
      </p>
    </Button>
  );
};

export default AddDocumentBtn;
