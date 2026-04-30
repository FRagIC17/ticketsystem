import { Component, inject } from '@angular/core';
import { Dashboard } from '../dashboard';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sla',
  imports: [FormsModule, CommonModule],
  templateUrl: './sla.html',
  styleUrl: './sla.css',
})
export class Sla {
  private dashboard = inject(Dashboard);

  // SLA helpers - calculate due date based on priority
  // Get SLA window in hours based on ticket priority
  getSLAWindow(priority: string): number {
    const p = (priority || '').trim().toLowerCase();
    switch (p) {
      case 'critical': return 4;
      case 'high': return 8;
      case 'medium': return 24;
      case 'low': return 72;
      default: return 24; // default 24 hours
    }
  }

  // Get calculated SLA due date for a ticket (createdAt + SLA window)
  getCalculatedSLADueDate(ticket: any): Date | null {
    if (!ticket?.createdAt) return null;
    const created = new Date(ticket.createdAt);
    if (isNaN(created.getTime())) return null;
    const window = this.getSLAWindow(ticket?.priority);
    const due = new Date(created.getTime() + window * 3600000);
    return due;
  }

  // Count all tickets that have a createdAt field (all tickets have an SLA)
  slaTotalCount(): number {
    const all = this.dashboard.tickets();
    if (!all || !Array.isArray(all)) return 0;
    return all.filter(t => !!t?.createdAt).length;
  }

  // Count tickets whose calculated SLA due date is in the past
  slaBreachedCount(): number {
    const all = this.dashboard.tickets();
    if (!all || !Array.isArray(all)) return 0;
    const now = Date.now();
    return all.filter(t => {
      const due = this.getCalculatedSLADueDate(t);
      if (!due) return false;
      return due.getTime() < now;
    }).length;
  }

  // Percent of SLA tickets that are still within SLA
  slaCompliancePercent(): number {
    const total = this.slaTotalCount();
    if (total === 0) return 100;
    const ok = total - this.slaBreachedCount();
    return Math.round((ok / total) * 100);
  }

  // Percent of tickets that are breached
  slaBreachedPercent(): number {
    const total = this.slaTotalCount();
    if (total === 0) return 0;
    return Math.round((this.slaBreachedCount() / total) * 100);
  }

  // Visual percent for the circle:
  // - full green ring when nothing is breached
  // - red breached portion when there are breaches
  slaCirclePercent(): number {
    if (!this.isSlaBreached()) return 100;
    return this.slaBreachedPercent();
  }

  // Get dasharray for SVG circle (circumference is 2*π*54 ≈ 339.3)
  getCircleDasharray(): string {
    const circumference = 2 * Math.PI * 54;
    const percent = this.slaCirclePercent();
    const filledLength = (percent / 100) * circumference;
    return `${filledLength} ${circumference}`;
  }

  isSlaBreached(): boolean {
    return this.slaBreachedCount() > 0;
  }

  slaStrokeColor(): string {
    return this.isSlaBreached() ? '#dc2626' : '#16a34a';
  }
}
