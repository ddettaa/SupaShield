import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const file_path = resolve(process.cwd(), ".agents/skills/supashield-pentest/SKILL.md");
  
  if (!existsSync(file_path)) {
    return new NextResponse("Skill documentation not found.", { status: 404 });
  }

  const content = readFileSync(file_path, "utf-8");
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8"
    }
  });
}
