import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 })
    }

    const categoryId = parseInt(params.id)
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Érvénytelen kategória azonosító' }, { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: 'Kategória nem található' }, { status: 404 })
    }

    await prisma.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json({ message: 'Kategória sikeresen törölve' })
  } catch (error) {
    console.error('Hiba a kategória törlése során:', error)
    return NextResponse.json({ 
      error: 'Szerver hiba a kategória törlése során',
      details: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }, { status: 500 })
  }
} 