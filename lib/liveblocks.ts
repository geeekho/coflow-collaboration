import { Liveblocks } from "@liveblocks/node";

const liveblocksSingleton = () => {
  return new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
  });
};

declare const globalThis: {
  liveBlocksGlobal: ReturnType<typeof liveblocksSingleton>;
} & typeof global;

const liveBlocks = globalThis.liveBlocksGlobal ?? liveblocksSingleton();

export default liveBlocks;

if (process.env.NODE_ENV !== "production")
  globalThis.liveBlocksGlobal = liveBlocks;
