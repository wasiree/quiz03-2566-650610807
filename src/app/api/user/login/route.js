import jwt from "jsonwebtoken";

import { DB, readDB } from "@/app/libs/DB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { username, password } = body;

  readDB();

  const user = DB.users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }

  const token = jwt.sign(
    { username, role: user.role, password: user.password },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
  return NextResponse.json({ ok: true, token });
};
