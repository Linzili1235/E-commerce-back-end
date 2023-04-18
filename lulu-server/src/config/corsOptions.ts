import allowedOrigins from "./allowedOrigins";

const corsOptions = {
    origin: allowedOrigins,
    credentials: true
}
export default corsOptions