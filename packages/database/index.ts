import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const createPrismaPg = () => {
  return new PrismaPg({ connectionString });
};
export { createPrismaPg, PrismaClient };
