'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { CreateCourseForm } from "@/app/components/course/CreateCourseForm";
import { BookOpen, Loader2 } from "lucide-react";
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

interface Course {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  category: {
    name: string;
  };
  user: {
    name: string | null;
    email: string;
  };
  enrollments: {
    id: number;
    user: {
      name: string | null;
      email: string;
    };
    enrolledAt: Date;
  }[];
}

interface CourseListProps {
  courses: Course[];
  onDeleteCourse: (courseId: number) => Promise<void>;
  onSelectCourse: (course: Course) => void;
}

export function CourseList({ courses, onDeleteCourse, onSelectCourse }: CourseListProps) {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCourse = async (courseId: number) => {
    try {
      setIsDeleting(true);
      await onDeleteCourse(courseId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
          <DialogTrigger asChild>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Új kurzus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Új kurzus létrehozása
              </DialogTitle>
            </DialogHeader>
            <CreateCourseForm onSuccess={() => {
              setShowCreateCourse(false);
            }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Kategória</TableHead>
              <TableHead>Létrehozó</TableHead>
              <TableHead>Beiratkozott diákok</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.category.name}</TableCell>
                <TableCell>{course.user.name || course.user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => onSelectCourse(course)}
                    className="hover:text-primary"
                  >
                    {course.enrollments.length} diák
                  </Button>
                </TableCell>
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
                        <AlertDialogTitle>Biztosan törölni szeretnéd ezt a kurzust?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ez a művelet nem vonható vissza. A kurzus azonnal törlésre kerül a rendszerből.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Mégse</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCourse(course.id)}
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