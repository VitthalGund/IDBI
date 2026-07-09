import { Injectable } from '@nestjs/common';

@Injectable()
export class MsmeService {
  async getCashflowData() {
    // Return mock data for MSME Cashflow Cockpit
    return {
      cashIn: 850000,
      cashOut: 420000,
      pendingInvoicesCount: 12,
      pendingInvoicesAmount: 200000,
      workingCapitalNudge: 'You have ₹2,00,000 in pending invoices. Need an advance?',
      chartData: [
        { month: 'Jan', cashIn: 600000, cashOut: 300000 },
        { month: 'Feb', cashIn: 750000, cashOut: 350000 },
        { month: 'Mar', cashIn: 850000, cashOut: 420000 },
      ]
    };
  }
}
