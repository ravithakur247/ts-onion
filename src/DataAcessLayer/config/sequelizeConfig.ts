export const config = {
  database: process.env.DATABASE,
  username: process.env.DBUSER,
  password: process.env.PASSWORD,
  params: {
    port: process.env.PORT,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    operatorsAliases: process.env.OPERATIONALIASES,
    min: process.env.MIN,
    max: process.env.MAX,
    acquire: process.env.ACCQUIRE,
    idle: process.env.IDLE,
  },
};
