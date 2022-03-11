import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProductService } from 'src/core/product.service';
import { SalesInvoiceDtl } from 'src/core/sales-invoice-dtl.model';
import { SalesInvoice } from 'src/core/sales-invoice.model';
import { SalesInvoiceService } from 'src/core/sales-invoice.service';

@Component({
  selector: 'app-sales-invoice-add-edit',
  templateUrl: './sales-invoice-add-edit.component.html',
  styleUrls: ['./sales-invoice-add-edit.component.css']
})
export class SalesInvoiceAddEditComponent implements OnInit {
  onClose: Subject<boolean>;
  salesInvoiceObj: SalesInvoice = new SalesInvoice();

  title: any = '';

  productList: any = [];
  salesInvoiceDtlObj: SalesInvoiceDtl = new SalesInvoiceDtl();
  salesInvoiceDtlList: any = [];

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private salesInvoiceService: SalesInvoiceService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    console.log('Selected Obj: ', this.salesInvoiceObj);
    this.onClose = new Subject();
    this.getProductList();
  }

  saveOrUpdate(): void {
    if (this.salesInvoiceObj.id != null || this.salesInvoiceObj.id != undefined) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    this.salesInvoiceObj.invoiceDate = moment(new Date(this.salesInvoiceObj.invoiceDate)).toDate();
    if (this.salesInvoiceObj.invoiceNumber != null && this.salesInvoiceObj.invoiceDate != null && this.salesInvoiceObj.customerName != null && this.salesInvoiceObj.totalAmount != null) {
      this.salesInvoiceService.onSaveItem(this.salesInvoiceObj).subscribe(
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
      this.toastr.warning('', "Please Insert Data to All Field's...");
    }

  }

  update(): void {
    this.salesInvoiceObj.invoiceDate = moment(new Date(this.salesInvoiceObj.invoiceDate)).toDate();
    if (this.salesInvoiceObj.invoiceNumber != null && this.salesInvoiceObj.invoiceDate != null && this.salesInvoiceObj.customerName != null && this.salesInvoiceObj.totalAmount != null) {
      this.salesInvoiceService.onUpdateItem(this.salesInvoiceObj).subscribe(
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

  getProductList() {
    this.productService.getAllList().subscribe(
      res => {
        if (res.success) {
          this.productList = res.items;
          console.log("Product List: ", this.productList);
        } else {
          this.toastr.warning('', res.message);
        }
      }, err => {
        this.toastr.warning('', err);
      }
    );
  }

  selectedProduct(val) {
    for (let items of this.productList) {
      if (items.productName === val) {
        this.salesInvoiceDtlObj.productId = items.id;
        this.salesInvoiceDtlObj.unitPrice = items.sellingPrice;
      }
    }
    console.log("selectedProduct this.salesInvoiceDtlObj: ", this.salesInvoiceDtlObj);
  }

  changedQuantity(val) {
    if (this.salesInvoiceDtlObj.unitPrice != null) {
      this.salesInvoiceDtlObj.amount = this.salesInvoiceDtlObj.unitPrice * val;
      this.salesInvoiceObj.totalAmount = this.salesInvoiceDtlObj.amount;
    }
    console.log("changedQuantity this.salesInvoiceDtlObj: ", this.salesInvoiceDtlObj);
  }

  addProductDtl() {
    this.salesInvoiceDtlList.push(this.salesInvoiceDtlObj);
    // this.salesInvoiceDtlList.draw();
  }

  setValue(val) {
    console.log("Selected Item:", val);
  }

}
