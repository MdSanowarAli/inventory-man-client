import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SalesInvoiceService } from 'src/core/sales-invoice.service';
import { environment } from 'src/environments/environment';
import { SalesInvoiceAddEditComponent } from './sales-invoice-add-edit/sales-invoice-add-edit.component';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent implements OnInit {
  id: number;
  selectedItem: any;

  @ViewChild('salesInvoiceGridListTable', { static: true }) salesInvoiceGridListTable: any;
  salesInvoiceList: any;
  salesInvoiceListObj: any;
  dataParam: any = {};

  // For Modal
  bsModalRef: BsModalRef;
  prescroptionBsModalRef: BsModalRef;

  constructor(
    private salesInvoiceService: SalesInvoiceService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.salesInvoicelistGrid();
  }

  salesInvoicelistGrid() {
    let that = this;
    this.salesInvoiceList = $(this.salesInvoiceGridListTable.nativeElement);
    this.salesInvoiceListObj = this.salesInvoiceList.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: environment.baseUrl + environment.inventoryManApiUrl + '/sales-invoice/grid-list',
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
        //   title: 'salesInvoice ID',
        //   data: 'id',
        // },
        {
          title: 'Invoice Number',
          data: 'invoiceNumber',
          name: 'invoiceNumber',
        },
        {
          title: 'Invoice Date',
          data: 'invoiceDate',
          render: (data) => {
            return moment(data).format("DD/MM/YYYY")
          }
        },
        {
          title: 'Customer Name',
          data: 'customerName',
          name: 'customerName',
        },
        {
          title: 'Total Amount',
          data: 'totalAmount',
          name: 'totalAmount',
        },
        {
          title: 'Action',
          className: 'text-center',
          render: function (data, type, row) {
            return '<button class="btn-danger deleteSalesInvoice"><i class="fas fa-trash-alt"></i> Delete</button>';
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
        $(row).find('.deleteSalesInvoice').click(function () {
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
      title: 'Add Sales Invoice'
    }
    this.bsModalRef = this.modalService.show(SalesInvoiceAddEditComponent, { class: 'modal-lg', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result == true) {
        this.salesInvoiceListObj.draw();
      }
    });
  }

  edit(): void {
    if (this.selectedItem) {
      // this.selectedItem.invoiceDate = this.selectedItem.invoiceDate ? moment(new Date(this.selectedItem.invoiceDate)).format('DD-MM-YYYY') : null;
      const initialState = {
        salesInvoiceObj: this.selectedItem,
        title: 'Edit Sales Invoice'
      }
      this.bsModalRef = this.modalService.show(SalesInvoiceAddEditComponent, { class: 'modal-xl', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe(result => {
        if (result == true) {
          this.salesInvoiceListObj.draw();
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
      this.salesInvoiceService.onDelete(selectedItem.id).subscribe(
        () => {
          this.toastr.success('', "Deleted Successfull")
          this.selectedItem = null;
          this.salesInvoiceListObj.draw();
        },
        () => {
          this.toastr.warning('', "Not Delete, Please Check")
        }
      )
    }
  }
}
