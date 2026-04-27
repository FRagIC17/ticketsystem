import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Ticketboard } from './components/dashboard/ticketboard/ticketboard';
import { NgModule } from '@angular/core';
import { Createticket } from './components/dashboard/ticketboard/createticket/createticket';
import { Knowledgebase } from './components/dashboard/knowledgebase/knowledgebase';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    {path: '', component: MainLayout, children: [
        {path: '', component: Dashboard},
        {path: 'my-tickets', component: Ticketboard},
        {path: 'knowledge-base', component: Knowledgebase},
        {path: 'create-ticket', component: Createticket}
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
