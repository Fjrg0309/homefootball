import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'badge';
}

export interface TableData {
  [key: string]: any;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: TableData[] = [];
  @Input() responsive: 'scroll' | 'cards' = 'cards';
  @Input() striped: boolean = true;
  @Input() hoverable: boolean = true;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.data = [...this.data].sort((a, b) => {
      const aVal = a[column.key];
      const bVal = b[column.key];

      if (aVal === bVal) return 0;

      const comparison = aVal > bVal ? 1 : -1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getSortIcon(column: TableColumn): string {
    if (!column.sortable) return '';
    if (this.sortColumn !== column.key) return '⇅';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}
