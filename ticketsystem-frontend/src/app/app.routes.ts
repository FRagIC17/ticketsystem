import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    { path : '', redirectTo: 'dashboard', pathMatch: 'full' },
    
    {
        path: '', component: MainLayout, 
        children: 
        [ 
            { path: 'dashboard', loadComponent() { return import('./components/dashboard/dashboard').then(m => m.Dashboard); } },
            { path: 'tickets/:id', loadComponent() { return import('./components/dashboard/selectedticket/selectedticket').then(m => m.Selectedticket); } },
            { path: 'knowledge-base', loadComponent() { return import('./components/knowledgebase/knowledgebase').then(m => m.Knowledgebase); } },
            { path: 'create-ticket', loadComponent() { return import('./components/dashboard/createticket/createticket').then(m => m.Createticket); } },
            { path: 'contact', loadComponent() { return import('./components/contact/contact').then(m => m.Contact); } },
            { path: 'about', loadComponent() { return import('./components/about/about').then(m => m.About); } }
        ]
    },

    { path: '**', redirectTo: 'dashboard' }
];

export class AppRoutingModule { }
