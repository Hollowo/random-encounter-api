import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserBody {
	@IsNotEmpty()
	@Length(3, 100)
	name: string;
}
