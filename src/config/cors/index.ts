export const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://realtime-learning-fe.vercel.app',
        'https://realtime-learning-fe-midterm.vercel.app',
        'https://realtime-learning-fe-ga02.vercel.app',
        'https://realtime-learning-fe.onrender.com',
        'https://realtime-learning-fe-ga02.netlify.app',
        'https://realtime-learning-fe-ga03.onrender.com',
        'https://realtime-learning-fe-main.onrender.com',
    ],
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
}
