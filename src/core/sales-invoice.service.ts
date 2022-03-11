import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesInvoiceService {

  private END_POINT = `sales-invoice`;

  private CREATE = `${environment.baseUrl}${environment.inventoryManApiUrl}/${this.END_POINT}/create`;
  private UPDATE = `${environment.baseUrl}${environment.inventoryManApiUrl}/${this.END_POINT}/update`;
  private DELETE = `${environment.baseUrl}${environment.inventoryManApiUrl}/${this.END_POINT}/delete`;
  private LIST = `${environment.baseUrl}${environment.inventoryManApiUrl}/${this.END_POINT}/list`;
  private FIND_BY_ID = `${environment.baseUrl}${environment.inventoryManApiUrl}/${this.END_POINT}/find-by-id`;

  constructor(
    httpClient: HttpClient,
    private http: HttpClient,
  ) { }


  // Get all List
  getAllList(): Observable<any> {
    return this.http.get<any>(this.LIST);
  }

  // Get all List 2
  getAllList2() {
    return this.http.get(this.LIST).pipe(
      map((data: any) => data)
    );
  }

  // Get all List by id or something else
  // getAllListById(params: HttpParams): Observable<any> {
  //   return this.http.get<any>(this.LIST_BY_ID, { params });
  // }

  findById(id: any) {
    return this.http.get(this.FIND_BY_ID, {
      params: new HttpParams().set('id', id)
    }).pipe(
      map((data: any) => data
      ))
  }


  onSaveItem(reqObj: any): Observable<any> {
    return this.http.post<any>(this.CREATE, reqObj).pipe(
      map((data: any) => data
      ));
  }

  onUpdateItem(reqObj: any): Observable<any> {
    return this.http.post<any>(this.UPDATE, reqObj).pipe(
      map((data: any) => data
      ));
  }

  onDelete(reqObj: any): Observable<any> {
    const params = new HttpParams().set('id', reqObj);
    return this.http.delete<any>(this.DELETE, { params }).pipe(
      map((data: any) => data
      ));
  }
}
