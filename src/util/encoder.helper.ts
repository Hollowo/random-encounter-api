import { hashSync } from 'bcrypt';

interface EncoderHelper {
    encode(value: string, saltRounds: number): Promise<string>
}

const encode = async (value: string, saltRounds: number): Promise<string> => {
    return await hashSync(value, saltRounds)
}

export const EncoderHelper: EncoderHelper = {
    encode
}