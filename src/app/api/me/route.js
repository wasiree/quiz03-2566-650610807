import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Vasiree Nuntajan",
    studentId: "650610807",
  });
};
