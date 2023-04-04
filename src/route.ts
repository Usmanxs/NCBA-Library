import { lazy } from 'solid-js';
import { RouteDefinition } from "solid-app-router";
import Login from "./pages/auth/login";
import Dashboard from './pages/dash/dashboard';
// import DefaultLayout from './layout/defaultlayout';

export const routes: RouteDefinition[] = [
    {
        path: '/',
        component: Login
    },
    {
        path:'/Dashboard',
        component: Dashboard,
        // children:[
        //   { path: '/Dashboard',component:lazy(() => import('./pages/dash/dashboard'))}
        // ]
    }
]