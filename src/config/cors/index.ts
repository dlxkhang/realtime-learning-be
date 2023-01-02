export const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://realtime-learning-fe.vercel.app',
        'https://realtime-learning-fe-midterm.vercel.app',
        'https://realtime-learning-fe-ga02.vercel.app',
        'https://realtime-learning-fe.onrender.com',
        'https://realtime-learning-fe-ga02.netlify.app',
        'https://realtime-learning-fe-test.vercel.app',
        'https://realtime-learning-fe-ga03.onrender.com',
        'https://realtime-learning-fe-main.onrender.com',
        'http://localhost:80',
        'https://realtime-learning.azurewebsites.net',
    ],
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
}
