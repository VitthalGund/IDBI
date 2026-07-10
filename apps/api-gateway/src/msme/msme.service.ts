import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class MsmeService implements OnModuleInit {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async onModuleInit() {
    const count = await this.invoiceRepository.count();
    if (count === 0) {
      // Seed some invoices for the MSME account
      await this.invoiceRepository.save([
        {
          accountId: 2,
          invoiceNumber: 'INV-2026-001',
          amount: 50000.0,
          status: 'PENDING',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
        },
        {
          accountId: 2,
          invoiceNumber: 'INV-2026-002',
          amount: 75000.0,
          status: 'OVERDUE',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // -2 days
        },
        {
          accountId: 2,
          invoiceNumber: 'INV-2026-003',
          amount: 20000.0,
          status: 'PAID',
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // -10 days
        },
      ]);
    }
  }

  async getCashflowData(deviceId: string) {
    const invoices = await this.invoiceRepository.find({
      where: { accountId: 2 },
    });
    const transactions = await this.transactionRepository.find({
      where: { deviceId },
    });

    const pendingInvoices = invoices.filter(
      (i) => i.status === 'PENDING' || i.status === 'OVERDUE',
    );
    const pendingInvoicesCount = pendingInvoices.length;
    const pendingInvoicesAmount = pendingInvoices.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );

    const cashIn = transactions
      .filter((t) => t.type === 'credit')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const cashOut = transactions
      .filter((t) => t.type === 'debit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Mock chart data for now, could be dynamic based on transactions
    const chartData = [
      { month: 'Jan', cashIn: 600000, cashOut: 300000 },
      { month: 'Feb', cashIn: 750000, cashOut: 350000 },
      { month: 'Mar', cashIn: 850000, cashOut: 420000 },
    ];

    let workingCapitalNudge = null;
    if (pendingInvoicesAmount > 50000) {
      workingCapitalNudge = `You have ₹${pendingInvoicesAmount.toLocaleString()} in pending invoices. Need an advance?`;
    }

    return {
      cashIn,
      cashOut,
      pendingInvoicesCount,
      pendingInvoicesAmount,
      workingCapitalNudge,
      chartData,
      invoices,
    };
  }
}
