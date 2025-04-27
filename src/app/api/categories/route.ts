import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Hiba a kategóriák lekérése során:', error);
    return NextResponse.json(
      { error: "Hiba a kategóriák lekérése során" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "A név megadása kötelező" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Hiba a kategória létrehozása során:', error);
    return NextResponse.json(
      { error: "Hiba a kategória létrehozása során" },
      { status: 500 }
    );
  }
} 