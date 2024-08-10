import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { Student } from '../../enterprise/entities/student';
import { HashGenerator } from '../cryptography/hash-generator';
import { IStudentRepository } from '../repositories/student';
import { StudentAlreadyExistsError } from './errors/student-already-exists';

type RegisterStudentUseCaseParams = {
  name: string;
  email: string;
  password: string;
};

type RegisterStudentUseCaseReturn = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: IStudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseParams): Promise<RegisterStudentUseCaseReturn> {
    const studentExists = await this.studentsRepository.findByEmail(email);

    if (studentExists) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}
