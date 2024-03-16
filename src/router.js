import { createRouter, createWebHistory } from 'vue-router';

// IMPORTARE TUTTE LE PAGINE DALLA CARTELLA "PAGES"
import HomePage from './pages/HomePage.vue';
import TaskIndex from './pages/TaskIndex.vue';


// CREIAMO IL ROUTER CON LE SUE ROTTE
const router = createRouter({

    history: createWebHistory(),

    routes: [
        {
            path: '/',
            name: 'home-page',
            component: HomePage,
        },
        {
            path: '/todo-list',
            name: 'todo-list',
            component: TaskIndex,
        },
        // {
        //     path: '/:catchAll(.*)',
        //     redirect: '/pagina-non-trovata',
        // },
        // {
        //     path: '/not-found',
        //     name: 'not-found',
        //     component: NotFound,
        // },
    ]

})

// ESPORTIAMO IL ROUTER
export { router }