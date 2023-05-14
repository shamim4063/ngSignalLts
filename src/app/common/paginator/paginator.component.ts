import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
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
  displayPrev = signal(false);
  displayNext = signal(false);

  pages = signal<number[]>([])
  pagesNums = signal<number[]>([]);

  ngOnChanges(changes: SimpleChanges) {

    if (changes['totalItems']) {
      this.totalItems = changes['totalItems'].currentValue;
      this.calculatePageNums()
    }

    if (changes['itemsPerPage'] && changes['itemsPerPage'].currentValue != this.currentPage) {
      this.itemsPerPage = changes['itemsPerPage'].currentValue;
      this.calculatePageNums();
    }

  }

  pageChange(pageNo: number) {
    if (pageNo !== this.currentPage) {
      this.currentPage = pageNo;
      this.onPageChange.emit(pageNo);
      this.updatePageNums();
      this.updateBoundaryLinksState()
    }
  }

  private updatePageNums() {
    const maxPageNo = Math.max(...this.pagesNums());
    const minPageNo = Math.min(...this.pagesNums())
    const hasMore = (this.currentPage >= maxPageNo - 1) && (maxPageNo !== (Math.max(...this.pages())));
    const hasLess = (this.currentPage <= minPageNo + 1) && (minPageNo != 1);
    if (hasMore || hasLess) {
      const [start, end] = this.currentPage > (this.pageNum / 2) ? [((this.currentPage + 2) - this.pageNum), (this.currentPage + 2)] : [(this.currentPage - 2), ((this.currentPage - 2) + this.pageNum)]
      this.pagesNums.set(this.pages().slice(start, end));
    }
  }

  private calculatePageNums() {
    this.pages.set([...Array(Math.ceil(this.totalItems / this.itemsPerPage))].map((x, i) => i + 1));
    const [min, max] = [Math.min(...this.pages()), Math.max(...this.pages())]
    let start = this.currentPage - 3 > min ? this.currentPage - 3 : 0;
    let end = start + this.pageNum;
    if (end > max) {
      start = start - (end - max);
      end = max;
    }
    this.pagesNums.set(this.pages().slice(start, end));
    this.updateBoundaryLinksState();
  }

  private updateBoundaryLinksState() {
    const showNextBoundaryLink = Math.max(...this.pages()) > this.pageNum && this.currentPage != Math.max(...this.pages());
    const showPrevBoundaryLink = this.currentPage > Math.min(...this.pages());

    this.displayNext.set(showNextBoundaryLink);
    this.displayPrev.set(showPrevBoundaryLink);
  }

}
