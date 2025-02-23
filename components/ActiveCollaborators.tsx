"use client";

import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";

const ActiveCollaborators = () => {
  const others = useOthers();
  const collaborators = others.map((other) => other.info);
  return (
    <ul className="collaborators-list">
      {collaborators.length > 0 &&
        collaborators.map((x) => (
          <li key={x.id}>
            <Image
              src={x.avatar}
              alt={x.name}
              width={100}
              height={100}
              className="inline-block size-8 rounded-full ring-2 ring-dark-100"
              style={{ border: `3px solid ${x.color}` }}
            />
          </li>
        ))}
    </ul>
  );
};

export default ActiveCollaborators;
