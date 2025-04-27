import { NextRequest } from 'next/server';
import { ReactNode } from 'react';

export interface TeacherRequest extends NextRequest {
    auth?: {
        user?: {
            roleId: number;
        };
    };
}

export interface CourseCreateBody {
    course_name: string;
    description: string;
    category_id: number;
    materials?: CourseMaterial[];
}

export interface CourseUpdateBody {
    name: string;
    description: string;
    isActive?: boolean;
}

export interface CourseMaterial {
    file_name: string;
}

export interface CourseStats {
    active: ReactNode;
    total: ReactNode;
    total_enrollments: number;
    total_materials: number;
}

export interface CourseWithStats {
    course_id: number;
    course_name: string;
    description: string;
    created_at: Date;
    category: {
        category_id: number;
        category_name: string;
    };
    materials: {
        material_id: number;
        courseId: number;
        created_at: Date;
        file: {
            file_id: number;
            file_name: string;
            coursematerialId: number;
            submissionId: string;
            assignmentId: string;
            created_at: Date;
        }[];
    }[];
    enrollment: {
        enrollment_id: number;
        email: string;
        enrolment_date: Date;
        course_id: number;
    }[];
    stats: CourseStats;
} 