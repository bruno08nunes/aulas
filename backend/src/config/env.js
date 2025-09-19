import "dotenv/config";

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "production",
    JWT_SECRET: process.env.JWT_SECRET ?? "segredo",
    PORT: process.env.PORT ?? 3333,
    HOST: process.env.HOST ?? "localhost",
    USER: process.env.USER ?? "root",
    PASSWORD: process.env.PASSWORD ?? "root",
    DATABASE: process.env.DATABASE ?? "aulas_ne_pai"
}