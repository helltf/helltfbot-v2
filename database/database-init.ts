import { PrismaClient } from "@prisma/client"

const dbClient = new PrismaClient()

export {dbClient}