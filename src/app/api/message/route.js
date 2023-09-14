import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const foundRoom = DB.rooms.find((x) => x.roomId === roomId);
  let filtered = DB.messages;
  if (roomId !== null) {
    filtered = filtered.filter((std) => std.roomId === roomId);
  }

  if (!foundRoom)
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );

  return NextResponse.json({
    ok: true,
    message: filtered,
  });
};

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const roomId = body.roomId;
  const foundRoom = DB.rooms.find((x) => x.roomId === roomId);
  let filtered = DB.messages;
  if (roomId !== null)
    filtered = filtered.filter((std) => std.roomId === roomId);

  if (!foundRoom)
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );

  const messageId = nanoid();
  const messageText = body.messageText;

  DB.messages.push({
    roomId,
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();
  const role = payload.role;

  if (!payload || role !== "SUPER_ADMIN")
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  const body = await request.json();
  const messageId = body.messageId;

  readDB();

  const foundMessageIndex = DB.messages.findIndex(
    (x) => x.messageId === messageId
  );
  if (foundMessageIndex === -1)
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );

  DB.messages.splice(foundMessageIndex, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
