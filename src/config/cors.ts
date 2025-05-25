import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  // Allow all domains
  // origin: ['http://localhost:3000'],
  origin: "*",

  // Specify allowed HTTP methods
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  // Specify allowed headers
  allowedHeaders: ["Content-Type", "Authorization"],

  // Allow credentials (this can be set to false if origin is "*")
  credentials: true,

  // Alternatively, you can use a function to allow all origins (uncomment below)
  // origin: (origin, callback) => {
  //   callback(null, true); // Allow all origins
  // },
};

export default corsOptions;
