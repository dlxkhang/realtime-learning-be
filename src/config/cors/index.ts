export const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://realtime-learning-fe.vercel.app',
        'https://realtime-learning-fe-midterm.vercel.app',
    ],
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
}
