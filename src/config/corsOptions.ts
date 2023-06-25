import allowedOrigins from "./allowedOrigins";

// const corsOptions = {
//     origin: allowedOrigins,
//     credentials: true
// }

const corsOptions = {
    origin: (origin: string, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'),false);
        }
    },
    optionsSuccessStatus: 200
}
export default corsOptions