import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Ticketboard } from './components/dashboard/ticketboard/ticketboard';
import { NgModule } from '@angular/core';
import { Faqpage } from './components/dashboard/faqpage/faqpage';
import { Createticket } from './components/dashboard/ticketboard/createticket/createticket';

export const routes: Routes = [
    {path: '', component: Dashboard},
    {path: 'my-tickets', component: Ticketboard},
    {path: 'faq', component: Faqpage},
    {path: 'create-ticket', component: Createticket}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
