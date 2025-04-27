"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
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

interface Student {
    id: string;
    name: string | null;
    email: string;
    enrollmentId: number;
}

interface StudentsProps {
    courseId: number;
}

export function Students({ courseId }: StudentsProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

    const fetchStudents = async () => {
        try {
            setError(null);
            const response = await fetch(`/api/services/teacher/course/${courseId}/students`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Nem sikerült betölteni a diákokat");
            }
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Hiba a diákok betöltésekor:", error);
            setError(error instanceof Error ? error.message : "Hiba történt a diákok betöltésekor");
            toast.error(error instanceof Error ? error.message : "Hiba történt a diákok betöltésekor");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveStudent = async (enrollmentId: number) => {
        try {
            setIsDeleting(true);
            setError(null);
            const response = await fetch(
                `/api/services/teacher/course/${courseId}/students?enrollmentId=${enrollmentId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Nem sikerült eltávolítani a diákot");
            }

            toast.success("Diák sikeresen eltávolítva");
            fetchStudents();
        } catch (error) {
            console.error("Hiba a diák eltávolítása közben:", error);
            setError(error instanceof Error ? error.message : "Hiba történt a diák eltávolítása közben");
            toast.error(error instanceof Error ? error.message : "Hiba történt a diák eltávolítása közben");
        } finally {
            setIsDeleting(false);
            setStudentToDelete(null);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Beiratkozott diákok</h2>
            {students.length === 0 ? (
                <p className="text-muted-foreground">Nincs beiratkozott diák</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Név</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Műveletek</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell className="text-right">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => setStudentToDelete(student.enrollmentId)}
                                            >
                                                Eltávolítás
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Biztosan el szeretnéd távolítani ezt a diákot?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Ez a művelet nem vonható vissza. A diák azonnal eltávolításra kerül a kurzusról.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => studentToDelete && handleRemoveStudent(studentToDelete)}
                                                    disabled={isDeleting}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {isDeleting ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            Eltávolítás...
                                                        </>
                                                    ) : (
                                                        "Eltávolítás"
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
            )}
        </div>
    );
} 