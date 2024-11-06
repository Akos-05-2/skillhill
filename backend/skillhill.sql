CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE SET NULL ON UPDATE CASCADE
);

alter table Users
    add column  subscribed bool NOT NULL;

CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

alter table `Courses`
    add column user_id INT,
    add foreign key (user_id) REFERENCES Users(user_id),
    add column document_id INT,
    add foreign key (document_id) REFERENCES Documents(document_id);

CREATE TABLE Course_materials (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    document_id int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (document_id) REFERENCES Documents(document_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    title VARCHAR(100) NOT NULL,
    due_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT,
    user_id INT,
    document_id INT,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (document_id) REFERENCES Documents(document_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Documents(
    document_id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE Document_files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES Documents(document_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);