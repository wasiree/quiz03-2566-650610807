import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const rooms = DB.rooms;
  let totalRooms = 0;
  for (const room of DB.rooms) {
    totalRooms++;
  }
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: totalRooms,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  let role = null;
  let roomName = null;
  try {
    role = payload.role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    readDB();
    const body = await request.json();
    const { roomName } = body;
    const foundRoom = DB.rooms.find((x) => x.roomName === roomName);
    if (foundRoom) {
      return NextResponse.json(
        {
          ok: false,
          message: `Room ${"replace this with room name"} already exists`,
        },
        { status: 400 }
      );
    }

    const roomId = nanoid();
    DB.rooms.push({
      roomName,
      roomId,
    });
    //call writeDB after modifying Database
    writeDB();

    return NextResponse.json({
      ok: true,
      roomId,
      message: `Room ${roomName} has been created`,
    });
  }
};
