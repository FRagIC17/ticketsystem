import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { NgModule } from '@angular/core';
import { Createticket } from './components/dashboard/createticket/createticket';
import { Knowledgebase } from './components/knowledgebase/knowledgebase';
import { MainLayout } from './layout/main-layout/main-layout';
import { Selectedticket } from './components/dashboard/selectedticket/selectedticket';
import { Contact } from './components/contact/contact';

export const routes: Routes = [
    {path: '', component: MainLayout, children: [
        {path: '', component: Dashboard},
        {path: 'ticket/:id', component: Selectedticket},
        {path: 'knowledge-base', component: Knowledgebase},
        {path: 'create-ticket', component: Createticket},
        {path: 'contact', component: Contact}
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
