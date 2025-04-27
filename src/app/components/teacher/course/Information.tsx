import { Course } from "@/app/types";
import { CardHeader, CardTitle } from "../../ui/card";
import { CardContent } from "../../ui/card";
import { Card } from "../../ui/card";

export default function Info({course}: {course: Course}){
    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-gray-900">Kurzus információk</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Kurzus neve</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '-28px' }} className="text-lg font-medium text-gray-900 mt-1">{course?.name}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Kategória</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '-24px' }} className="mt-1 text-gray-800">{course?.category?.name}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Állapot</h3>
                        <p  style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '-24px', marginLeft: '197px' }} className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                course?.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-red-800'  
                                }`}>
                                {course?.is_active ? 'Aktív' : 'Inaktív'}
                            </span>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>    
    );
}