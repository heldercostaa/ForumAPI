import { Student } from '../../enterprise/entities/student';

export abstract class IStudentRepository {
  abstract findByEmail(email: string): Promise<Student | null>;
  abstract create(student: Student): Promise<void>;
}
