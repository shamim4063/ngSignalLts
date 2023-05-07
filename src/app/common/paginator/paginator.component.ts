import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  @Input()
  itemsPerPage = 10;

  @Input({ required: true })
  totalItems!: number;

  @Input({ required: true })
  currentPage!: number;

  @Output()
  onPageChange = new EventEmitter<number>();

  readonly pageNum = 5;
  pagesNums = signal([...Array(this.pageNum)].map((x, i) => i + 1));

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage'] && changes['currentPage'].currentValue != this.currentPage) {
      this.currentPage = changes['currentPage'].currentValue
    }
    if (changes['totalItems']) {
      this.calculatePageNums()
    }
  }

  pageChange(pageNo: number) {
    if (pageNo !== this.currentPage) {
      this.onPageChange.emit(pageNo);
    }
  }

  calculatePageNums() {
    const pages = [...Array(Math.ceil(this.totalItems / this.itemsPerPage))].map((x, i) => i + 1);
    if (pages.length) {
      const displayPages = pages.slice((this.currentPage - 1), this.pageNum);
      console.log(displayPages);
    }
  }

}
