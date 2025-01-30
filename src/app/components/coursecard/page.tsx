import { useSession } from "next-auth/react";
import axios from "axios";
import { ICourse } from "@/app/api/models/course";
import { CourseCardProps } from "@/app/api/models/coursecardprops";
import { useEffect, useState } from "react";
import "./style.css";

export async function fetchCourses(): Promise<ICourse[]> {
    try {
        const response = await axios.get<ICourse[]>("http://localhost:3000/api/services/course");
        console.log("Kurzusok lekérése sikeres:", response.data); 
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}


async function enrollCourse(email: string, course_id: number) {
  console.log("Beiratkozás adatok a küldés előtt:", { email, course_id }); 
  try {
      const response = await axios
        .post(
          "http://localhost:3000/api/services/enrollment",
          {
              course_id,
              email,
          },
          {
              headers: {
                  'Content-Type': 'application/json',
              },
          }
      );
      JSON.stringify(response.data);
      console.log("Beiratkozás API válasz:", response.data);
      return response.data;
  } catch (error) {
      console.error("Hiba az API hívás során:", error);
      throw error;
  }
}

const CourseCard: React.FC<CourseCardProps> = ({ c }) => {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState(c);

  useEffect(() => {
    if (searchQuery) {
      const result = c.filter(course =>
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(result);
    } else {
      setFilteredCourses(c);
    }
  }, [searchQuery, c]);

  console.log("Kurzusok:", filteredCourses);

  return (
    <div>
        <div>
            <input
            type="text"
            placeholder="Keresés kurzus neve alapján..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="course-list">
            {filteredCourses.length === 0 ? (
            <p className="search-error">Ilyen néven nincs elérhető kurzus!</p>
            ) : (
            filteredCourses.map((course) => (
                <div key={course.course_id} className="course-card">
                <h3>{course.course_name}</h3>
                <div className="description">
                    <p>{course.description}</p>
                </div>
                <br />
                <button
                    className="enroll-button"
                    onClick={async () => {
                    console.log("Beiratkozás gomb megnyomva, kurzus id:", course.course_id);

                    if (status === 'authenticated' && session?.user?.email) {
                        try {
                        if (!course.course_name) {
                            console.error("Hiba: course_name nincs meghatározva!");
                            alert("Hiba: A kurzus neve hiányzik!");
                            return;
                        }

                        const result = await enrollCourse(session.user.email, course.course_id);
                        console.log("Beiratkozás sikeres:", result);
                        alert("Sikeres beiratkozás!");
                        } catch (error) {
                        console.error("Hiba a beiratkozás során:", error);
                        alert("Hiba történt a beiratkozás során.");
                        }
                    } else {
                        alert("Kérlek jelentkezz be a beiratkozáshoz!");
                    }
                    }}
                >
                    Jelentkezés
                </button>
                </div>
            ))
            )}
            </div>
    </div>
  );
};

export default CourseCard;

