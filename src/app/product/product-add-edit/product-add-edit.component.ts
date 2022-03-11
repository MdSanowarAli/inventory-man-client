import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Product } from 'src/core/product.model';
import { ProductService } from 'src/core/product.service';

@Component({
  selector: 'app-product-add-edit',
  templateUrl: './product-add-edit.component.html',
  styleUrls: ['./product-add-edit.component.css']
})
export class ProductAddEditComponent implements OnInit {
  onClose: Subject<boolean>;
  productObj: Product = new Product();

  title: any = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    console.log('Selected Obj: ', this.productObj);
    this.onClose = new Subject();
  }

  saveOrUpdate(): void {
    if (this.productObj.id != null || this.productObj.id != undefined) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    // this.productObj.invoiceDate = moment(new Date(this.productObj.invoiceDate)).toDate();
    if (this.productObj.productCode != null && this.productObj.productName != null && this.productObj.sellingPrice != null) {
      this.productService.onSaveItem(this.productObj).subscribe(
        res => {
          if (res.success) {
            this.toastr.success('', res.message);
            this.bsModalRef.hide();
            this.onClose.next(true);
          } else {
            this.toastr.warning('', res.message);
            this.onClose.next(true);
          }
        }, err => {
          console.error('Error occured when save ', err);
          this.toastr.error('Error occured when save', err.message);
          this.bsModalRef.hide();
          this.onClose.next(true);
        }
      );
    } else {
      this.toastr.warning('', "Please Insert Data to All Mendatory Field's...");
    }

  }

  update(): void {
    // this.productObj.invoiceDate = moment(new Date(this.productObj.invoiceDate)).toDate();
    if (this.productObj.productCode != null && this.productObj.productName != null && this.productObj.sellingPrice != null) {
      this.productService.onUpdateItem(this.productObj).subscribe(
        res => {
          if (res.success) {
            this.toastr.success('', res.message);
            this.bsModalRef.hide();
            this.onClose.next(true);
          } else {
            this.toastr.warning('', res.message);
            this.onClose.next(false);
          }
        }, err => {
          console.error('Error occured when Update', err);
          this.toastr.error('Error occured when Update', err.message);
          this.bsModalRef.hide();
          this.onClose.next(true);
        }
      );
    } else {
      this.toastr.warning('', "Please Insert Data to All Field's...");
    }
  }
}
