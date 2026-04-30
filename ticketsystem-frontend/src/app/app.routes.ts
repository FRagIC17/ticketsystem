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
    {path: '', component: MainLayout, children: [
        {path: '', component: Dashboard},
        {path: 'tickets/:id', component: Selectedticket},
        {path: 'knowledge-base', component: Knowledgebase},
        {path: 'create-ticket', component: Createticket},
        {path: 'contact', component: Contact},
        {path: 'about', component: About}
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
