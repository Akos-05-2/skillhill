'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/components/ui/button";
import { SendNewsletterForm } from "@/app/components/admin/SendNewsletterForm";
import { CreateCategoryForm } from "@/app/components/course/CreateCategoryForm";
import { CreateCourseForm } from "@/app/components/course/CreateCourseForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { toast } from "sonner";
import { Menu, X, BookOpen, Users, User, FolderOpen, Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
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
import { CourseList } from "@/app/components/admin/CourseList";
import { UserList } from "@/app/components/admin/UserList";
import { CategoryList } from "@/app/components/admin/CategoryList";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

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

interface User {
  id: string;
  name: string | null;
  email: string;
  role: {
    role_name: string;
  };
}

interface Role {
  id: string;
  role_name: string;
}

interface Category {
  id: number;
  name: string;
  courseCount: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user');
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Hiba a felhasználói adatok lekérése során');
        }
      const data = await response.json();
        setUserData(data);
        setError(null);
    } catch (error) {
        console.error('Hiba:', error);
        setError(error instanceof Error ? error.message : 'Ismeretlen hiba történt');
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status]);

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    console.log('User data:', userData);
    console.log('Error:', error);

    if (status === "loading") {
      console.log('Session is loading...');
      return;
    }

    if (!session) {
      console.log('No session found, redirecting to signin...');
      router.push("/auth/signin");
      return;
    }

    if (error) {
      console.log('Error occurred:', error);
      return;
    }

    if (!userData) {
      console.log('No user data found, waiting...');
      return;
    }

    const userRole = userData.role;
    console.log('Checking user role:', userRole);

    if (userRole !== "admin" && userRole !== "super_admin") {
      console.log('User does not have admin rights, redirecting to home...');
      router.push("/");
      return;
    }

    console.log('User has admin rights, allowing access...');
    const loadData = async () => {
      try {
        await fetchCourses();
        await fetchUsers();
        await fetchCategories();
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Hiba történt az adatok betöltése során');
      }
    };
    loadData();
  }, [session, status, router, userData, error]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/admin/roles');
        if (!response.ok) {
          throw new Error('Hiba a szerepkörök lekérése során');
        }
        const data = await response.json();
        console.log('Lekért szerepkörök:', data);
        setRoles(data);
      } catch (error) {
        console.error('Hiba:', error);
      }
    };

    if (userData?.role === 'admin' || userData?.role === 'super_admin') {
      fetchRoles();
    }
  }, [userData]);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses...');
      const response = await fetch("/api/admin/courses", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status} ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      console.log("Raw courses data:", JSON.stringify(data, null, 2));
      setCourses(data);
      console.log("Courses state after update:", JSON.stringify(courses, null, 2));
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error; // Továbbdobjuk a hibát, hogy a hívó kezelni tudja
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Hiba a kurzus törlése során');
      }

      toast.success('Kurzus sikeresen törölve');
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Hiba:', error);
      toast.error(error instanceof Error ? error.message : 'Hiba történt a kurzus törlése során');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      // Először lekérjük a szerepkör ID-t a név alapján
      const roleResponse = await fetch('/api/admin/roles');
      const roles = await roleResponse.json();
      const role = roles.find((r: any) => r.role_name === newRole);
      
      if (!role) {
        toast.error('A kiválasztott szerepkör nem található');
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleId: role.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Hiba a szerepkör módosítása során');
      }

      toast.success('Szerepkör sikeresen módosítva');
      fetchUsers(); // Frissítjük a felhasználók listáját
    } catch (error) {
      console.error('Hiba:', error);
      toast.error('Hiba történt a szerepkör módosítása során');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a felhasználó törlése során');
      }

      toast.success('Felhasználó sikeresen törölve');
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Hiba:', error);
      toast.error('Hiba történt a felhasználó törlése során');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      console.log("Categories data:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Hiba a kategória törlése során');
      }

      toast.success('Kategória sikeresen törölve');
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Hiba:', error);
      toast.error(error instanceof Error ? error.message : 'Hiba történt a kategória törlése során');
    }
  };

  const handleDeleteEnrollment = async (courseId: number, enrollmentId: number) => {
    try {
      const response = await fetch(`/api/services/teacher/course/${courseId}/enrollments/${enrollmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Hiba a beiratkozás törlése során');
      }

      toast.success('Beiratkozás sikeresen törölve');
      
      // Frissítjük a kiválasztott kurzus adatait
      setSelectedCourse(prev => prev ? {
        ...prev,
        enrollments: prev.enrollments.filter(e => e.id !== enrollmentId)
      } : null);

      // Frissítjük a kurzusok listáját is
      setCourses(courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            enrollments: course.enrollments.filter(e => e.id !== enrollmentId)
          };
        }
        return course;
      }));
    } catch (error) {
      console.error('Hiba:', error);
      toast.error(error instanceof Error ? error.message : 'Hiba történt a beiratkozás törlése során');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Hiba</h1>
      <p className="text-red-500">{error}</p>
    </div>;
  }

  if (!session || !userData) {
    console.log('No session or user data in render, returning null');
    return null;
  }

  const userRole = userData.role;
  if (userRole !== "admin" && userRole !== "super_admin") {
    console.log('User does not have admin rights in render, returning null');
    return null;
  }

  console.log('Rendering admin page for user with role:', userRole);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Adminisztráció</h1>
          <p className="text-gray-500">Kezeld a rendszert és a felhasználókat</p>
        </div>
      </div>

      {/* Mobil nézet */}
      <div className="flex justify-between items-center sm:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-4">
            <DialogTitle className="sr-only">Navigációs menü</DialogTitle>
            <div className="flex flex-col gap-2">
              <Tabs value={activeTab} orientation="vertical" className="w-full">
                <TabsList className="flex flex-col h-auto">
                  <TabsTrigger
                    value="courses"
                    onClick={() => setActiveTab("courses")}
                    className="flex items-center gap-2 px-4 py-2 w-full justify-start"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Kurzusok</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    onClick={() => setActiveTab("users")}
                    className="flex items-center gap-2 px-4 py-2 w-full justify-start"
                  >
                    <Users className="h-4 w-4" />
                    <span>Felhasználók</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="categories"
                    onClick={() => setActiveTab("categories")}
                    className="flex items-center gap-2 px-4 py-2 w-full justify-start"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>Kategóriák</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
        <span className="font-medium">
          {activeTab === "courses" && "Kurzusok"}
          {activeTab === "users" && "Felhasználók"}
          {activeTab === "categories" && "Kategóriák"}
        </span>
        <div className="w-9" /> {/* Kiegyensúlyozáshoz */}
      </div>

      <Tabs value={activeTab} className="w-full">
        {/* Asztali nézet */}
        <div className="hidden sm:block mb-8">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger
              value="courses"
              onClick={() => setActiveTab("courses")}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Kurzusok</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              onClick={() => setActiveTab("users")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span>Felhasználók</span>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              onClick={() => setActiveTab("categories")}
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Kategóriák</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Keresés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-96"
          />
        </div>

        <TabsContent value="courses">
          <CourseList 
            courses={filteredCourses} 
            onDeleteCourse={handleDeleteCourse}
            onSelectCourse={setSelectedCourse}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserList 
            users={filteredUsers}
            roles={roles}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryList 
            categories={filteredCategories}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>
      </Tabs>

      {selectedCourse && (
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Beiratkozások - {selectedCourse.name}</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Név</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Beiratkozás dátuma</TableHead>
                    <TableHead className="min-w-[100px]">Műveletek</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCourse.enrollments?.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>{enrollment.user?.name || 'Ismeretlen'}</TableCell>
                      <TableCell>{enrollment.user?.email || '-'}</TableCell>
                      <TableCell>
                        {enrollment.enrolledAt ? 
                          new Date(enrollment.enrolledAt).toLocaleDateString('hu-HU') : 
                          new Date(enrollment.id).toLocaleDateString('hu-HU')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost"
                          onClick={() => handleDeleteEnrollment(selectedCourse.id, enrollment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Törlés
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Nincsenek beiratkozások
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 