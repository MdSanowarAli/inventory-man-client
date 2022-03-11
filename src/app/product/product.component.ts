import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/core/product.service';
import { environment } from 'src/environments/environment';
import { ProductAddEditComponent } from './product-add-edit/product-add-edit.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id: number;
  selectedItem: any;

  @ViewChild('productGridListTable', { static: true }) productGridListTable: any;
  productList: any;
  productListObj: any;
  dataParam: any = {};

  // For Modal
  bsModalRef: BsModalRef;
  prescroptionBsModalRef: BsModalRef;

  constructor(
    private productService: ProductService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.productlistGrid();
  }

  productlistGrid() {
    let that = this;
    this.productList = $(this.productGridListTable.nativeElement);
    this.productListObj = this.productList.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: environment.baseUrl + environment.inventoryManApiUrl + '/product/grid-list',
        type: 'GET',
        data: function (sendData: any) {
          // sendData.id   = that.dataParam.id;
        },
        dataSrc: function (response) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          console.log("response: ", response.obj.data);
          return response.obj.data;

        },
        error: function (request) {
          console.log('request.responseText', request.responseText);
        }
      },
      'order': [[0, 'desc']],
      columns: [
        {
          title: 'SL',
          data: 'id',
          render: function (data, type, row, meta) {
            return '<span>' + (meta.row + 1) + '</span>';
          }
        },
        // {
        //   title: 'Product ID',
        //   data: 'id',
        // },
        {
          title: 'Product Code',
          data: 'productCode',
          name: 'productCode',
        },
        {
          title: 'Product Name',
          data: 'productName',
          name: 'productName',
        },
        {
          title: 'Selling Price',
          data: 'sellingPrice',
          name: 'sellingPrice',
        },
        // {
        //   title: 'Invoice Date',
        //   data: 'invoiceDate',
        //   render: (data) => {
        //     return moment(data).format("DD/MM/YYYY")
        //   }
        // },
        {
          title: 'Action',
          className: 'text-center',
          render: function (data, type, row) {
            return '<button class="btn-danger deleteProduct"><i class="fas fa-trash-alt"></i> Delete</button>';
          }
        }
      ],
      responsive: true,
      select: true,
      rowCallback: (row: Node, data: any[] | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedItem = data;
          console.log("Selected Patient ", self.selectedItem);
        });
        $(row).find('.deleteProduct').click(function () {
          that.onDelete(data);
        });
        $(row).on('dblclick', () => {
          this.edit();
        });
        return row;
      }
    });
  }

  add(): void {
    const initialState = {
      title: 'Add Product'
    }
    this.bsModalRef = this.modalService.show(ProductAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result == true) {
        this.productListObj.draw();
      }
    });
  }

  edit(): void {
    if (this.selectedItem) {
      // this.selectedItem.invoiceDate = this.selectedItem.invoiceDate ? moment(new Date(this.selectedItem.invoiceDate)).format('DD-MM-YYYY') : null;
      const initialState = {
        productObj: this.selectedItem,
        title: 'Edit Product'
      }
      this.bsModalRef = this.modalService.show(ProductAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe(result => {
        if (result == true) {
          this.productListObj.draw();
          this.selectedItem = null;
        }
      });
    } else {
      this.toastr.warning('', "Please select an Item")
    }
  }

  onDelete(selectedItem) {
    console.log('Selected Patient for Delete', selectedItem);
    if (selectedItem) {
      this.productService.onDelete(selectedItem.id).subscribe(
        () => {
          this.toastr.success('', "Deleted Successfull")
          this.selectedItem = null;
          this.productListObj.draw();
        },
        () => {
          this.toastr.warning('', "Not Delete, Please Check")
        }
      )
    }
  }

}
