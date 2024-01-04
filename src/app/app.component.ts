import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from './dialog/dialog.component';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private dialog: MatDialog, private api: ApiService) {}
  displayedColumns: string[] = [
    'productName',
    'category',
    'price',
    'date',
    'comment',
    'condition',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.getAllProduct();
  }
  title = 'OnlyUp';
  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === 'save') {
          this.getAllProduct();
        }
      });
  }
  getAllProduct() {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        alert('Something went wrong while get product');
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editProduct(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === 'update') {
          this.getAllProduct();
        }
      });
  }
  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        alert('dd');
        this.getAllProduct();
      },
      error: () => {
        alert('aaa');
      },
    });
  }
}
