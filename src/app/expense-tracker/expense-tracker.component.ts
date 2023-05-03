import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense-tracker',
  templateUrl: './expense-tracker.component.html',
  styleUrls: ['./expense-tracker.component.scss']
})
export class ExpenseTrackerComponent implements OnInit {

  constructor() { }
  public totalIncome: string = '$0';
    public totalExpense: string = '$0';
    public totalBalance: string = '$0';
    public totalTransactions: string = '0';
  ngOnInit(): void {
  }

}
