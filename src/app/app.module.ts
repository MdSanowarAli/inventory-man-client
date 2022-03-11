import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Common and Others
import { CommonModule } from '@angular/common';

// datatables
import { DataTablesModule } from 'angular-datatables';

//HTTP
import { HttpClientModule } from '@angular/common/http';

// Toastr and animation
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modal
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

// Date Picker
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';

//tooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProductComponent } from './product/product.component';
import { ProductAddEditComponent } from './product/product-add-edit/product-add-edit.component';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { SalesInvoiceAddEditComponent } from './sales-invoice/sales-invoice-add-edit/sales-invoice-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductAddEditComponent,
    SalesInvoiceComponent,
    SalesInvoiceAddEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    HttpClientModule,
    // CKEditorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ProductAddEditComponent,
    SalesInvoiceAddEditComponent
  ],
})
export class AppModule { }
