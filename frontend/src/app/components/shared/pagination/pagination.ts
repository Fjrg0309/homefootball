import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() maxVisiblePages: number = 5;
  @Input() showFirstLast: boolean = true;
  @Input() showPrevNext: boolean = true;
  
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): number[] {
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);

    if (endPage - startPage + 1 < this.maxVisiblePages) {
      startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  get showLeftEllipsis(): boolean {
    return this.visiblePages.length > 0 && this.visiblePages[0] > 1;
  }

  get showRightEllipsis(): boolean {
    return this.visiblePages.length > 0 && this.visiblePages[this.visiblePages.length - 1] < this.totalPages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  firstPage(): void {
    this.goToPage(1);
  }

  lastPage(): void {
    this.goToPage(this.totalPages);
  }
}
