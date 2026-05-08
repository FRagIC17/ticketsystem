import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { NgModule } from '@angular/core';
import { Createticket } from './components/dashboard/createticket/createticket';
import { Knowledgebase } from './components/knowledgebase/knowledgebase';
import { MainLayout } from './layout/main-layout/main-layout';
import { Selectedticket } from './components/dashboard/selectedticket/selectedticket';
import { Contact } from './components/contact/contact';
import { About } from './components/about/about';

export const routes: Routes = [
    {
        path: '', loadComponent() { return import('./layout/main-layout/main-layout').then(m => m.MainLayout); }, 
        children: 
        [ 
            { path: '', loadComponent() { return import('./components/dashboard/dashboard').then(m => m.Dashboard); } },
            { path: 'tickets/:id', loadComponent() { return import('./components/dashboard/selectedticket/selectedticket').then(m => m.Selectedticket); } },
            { path: 'knowledge-base', loadComponent() { return import('./components/knowledgebase/knowledgebase').then(m => m.Knowledgebase); } },
            { path: 'create-ticket', loadComponent() { return import('./components/dashboard/createticket/createticket').then(m => m.Createticket); } },
            { path: 'contact', loadComponent() { return import('./components/contact/contact').then(m => m.Contact); } },
            { path: 'about', loadComponent() { return import('./components/about/about').then(m => m.About); } }
        ]
    },
];

export class AppRoutingModule { }
