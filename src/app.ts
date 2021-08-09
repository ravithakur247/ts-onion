import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import { envPath } from "./config";
dotenv.config({ path: envPath });
import container from "./ApplicationLayer/di/inversify.config";
import {
  InversifyExpressServer
} from "inversify-express-utils";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import "./ApplicationLayer/controller";
import { connectDB } from "./DataAcessLayer";
import * as swagger from "swagger-express-ts";
const app = express();
const server = new InversifyExpressServer(
  container, 
  null,
  null,
  app
);

server
  .setConfig((app) => {
    app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static( 'node_modules/swagger-ui-dist' ));
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(helmet());
    app.use(cors());
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    app.use(bodyParser.json());
    app.use(swagger.express(
      {
        definition : {
          info : {
              title : "TS Onion" ,
              version : "1.0"
          },
          securityDefinitions: {
            BearerToken: {
              type: swagger.SwaggerDefinitionConstant.Security.Type.API_KEY,
              in: swagger.SwaggerDefinitionConstant.Security.In.HEADER,
              name: 'Authorization'
            }
          }
        }
      }
  ) );
  })
  .setErrorConfig((app) => {
  })
  .build()
  .listen(3000, async () => {
    await connectDB();
    console.log(`server liestening at 3000 port`);
  });
