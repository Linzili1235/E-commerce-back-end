import allowedOrigins from "./allowedOrigins";
import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: (origin: string, callback: Function) => {
        try {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Origin not allowed by CORS. Only 3000,4000 currently allowed in env'))
            }
        } catch (err) {
            console.error('Error in corsOptions.origin:', err)
            callback(err)
        }
    },
    optionsSuccessStatus: 200
}

export default corsOptions