export interface Category {
    id: number;
    name: string;
    courses: Course[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    role?: {
        role_name: string;
    };
}

export interface Enrollment {
    id: number;
    email: string;
    enrolledAt: Date;
    courseId: number;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
}

export interface Course {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    teacher_id: number;
    category_id: number;
    category?: {
        id: number;
        name: string;
    };
    user?: {
        id: string;
        name: string;
        email: string;
    };
    modules?: Module[];
    resources?: Resource[];
    enrollments?: Enrollment[];
    submissions?: Submission[];
}

export interface Module {
    id: number;
    name: string;
    description: string;
    order: number;
    course_id: number;
    created_at: string;
    updated_at: string;
}

export interface Resource {
    id: number;
    name: string;
    type: string;
    url: string;
    module_id: number;
    created_at: string;
    updated_at: string;
}

export interface Submission {
    id: number;
    user_id: number;
    module_id: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ModuleFormState {
    name: string;
    description: string;
    isCreating: boolean;
}

export interface FileUploadState {
    selectedModule: number | null;
    selectedFile: File | null;
    resourceName: string;
    isUploading: boolean;
}

export interface CourseSettingsState {
    name: string;
    description: string;
    isActive: boolean;
    isSaving: boolean;
}

export interface Material {
    id: number;
    name: string;
    course_id: number;
    module_id?: number;
    created_at: Date;
    updated_at: Date;
}

