'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { CreateCategoryForm } from "@/app/components/course/CreateCategoryForm";
import { FolderOpen, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

interface Category {
  id: number;
  name: string;
  courseCount: number;
}

interface CategoryListProps {
  categories: Category[];
  onDeleteCategory: (categoryId: number) => Promise<void>;
}

export function CategoryList({ categories, onDeleteCategory }: CategoryListProps) {
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      setIsDeleting(true);
      await onDeleteCategory(categoryId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
          <DialogTrigger asChild>
            <Button>
              <FolderOpen className="h-4 w-4 mr-2" />
              Új kategória
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Új kategória létrehozása</DialogTitle>
            </DialogHeader>
            <CreateCategoryForm onSuccess={() => {
              setShowCreateCategory(false);
            }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Kurzusok száma</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.courseCount} kurzus</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                      >
                        Törlés
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Biztosan törölni szeretnéd ezt a kategóriát?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ez a művelet nem vonható vissza. A kategória azonnal törlésre kerül a rendszerből.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Mégse</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Törlés...
                            </>
                          ) : (
                            "Törlés"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 