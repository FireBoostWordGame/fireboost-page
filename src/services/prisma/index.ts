import { PrismaClient } from "@prisma/client";

/* PrismaService is a class to instance new PrismaClient to need instance or inheriting to this class */
export default class PrismaService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
    // Call the function verify connection
    this.connect();
  }

  // this method verify to connection to database
  private connect(): void {
    this.prisma.$connect();
  }
}
