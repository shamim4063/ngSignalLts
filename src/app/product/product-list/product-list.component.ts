import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ProductService } from 'src/app/product/product.service';
import { RouterModule } from '@angular/router';
import { Product } from 'src/app/models/products.output.dto';
import { FormControl } from '@angular/forms';
import { SearchComponent } from 'src/app/common/search/search.component';
import { PaginatorComponent } from 'src/app/common/paginator/paginator.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, PaginatorComponent],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnDestroy {
  productService = inject(ProductService);

  products = signal<Array<Product>>([]);
  searchControl = new FormControl();
  searchTerm$ = new Subject<string>();

  totalItems = signal(0);
  currentPage = signal(1);
  readonly itemsPerPage = 10;
  searchTerm = '';

  subscription$ = new Subject<void>();

  ngOnInit() {
    this.fetchProducts();
    this.registerSearchListener();
  }

  private fetchProducts() {
    this.productService.getProducts(this.itemsPerPage, ((this.currentPage() - 1) * this.itemsPerPage), this.searchTerm)
      .pipe(
        map(({ products, total }) => ({ products, total }))
      )
      .subscribe(({ products, total }) => {
        this.products.set(products);
        this.totalItems.set(total);
      });
  }

  private registerSearchListener() {
    this.searchTerm$.pipe(
      takeUntil(this.subscription$),
      tap(text => {
        this.searchTerm = text;
        this.currentPage.set(1);
      }),
      switchMap(text => this.productService.getProducts(this.itemsPerPage, ((this.currentPage() - 1) * this.itemsPerPage), text)
        .pipe(
          catchError(() => EMPTY),
          map(({ products, total }) => ({ products, total }))
        )))
      .subscribe(({ products, total }) => {
        this.products.set(products);
        this.totalItems.set(total);
      });
  }

  pageChange(pageNo: number) {
    this.currentPage.set(pageNo);
    this.fetchProducts();
  }

  onDelete(id: number) {
    confirm('Are you sure to remove?') &&
      this.products.update((prevProducts) =>
        [...prevProducts].filter((x) => x.id !== id)
      );
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

}
