import bcrypt from 'bcrypt';

export const hashString = async (str: string): Promise<string> => {
    const saltRounds = 5;
    return await bcrypt.hash(str, saltRounds);
}

export const compareHash = async (str:string, hashed_str:string): Promise<boolean> => {
    return await bcrypt.compare(str, hashed_str);
}