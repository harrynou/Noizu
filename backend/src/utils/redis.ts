import redisClient from "../config/redis-config";


export const setToken = async (key: string , value: any, ttl: number): Promise<void> => {
    const stringValue = JSON.stringify(value)
    redisClient.set(key, stringValue, "EX", ttl)
}

export const getToken = async (key: string): Promise<any> => {
    const stringValue = await redisClient.get(key)
    return stringValue ? JSON.parse(stringValue) : null;

}

export const delToken = async (key:string): Promise<void> => {
    await redisClient.del(key);

}