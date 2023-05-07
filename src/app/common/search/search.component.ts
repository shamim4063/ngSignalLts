import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Output()
  onSearch = new EventEmitter<string>();

  searchInput = new FormControl();
  subscription$ = new Subject<void>();

  constructor() {
    this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.subscription$)
    )
      .subscribe(text => this.onSearch.emit(text))
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
