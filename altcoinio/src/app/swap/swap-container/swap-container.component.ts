import {Component, OnInit} from "@angular/core";
import {DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import {OrderService} from "../../services/order.service";
import {AppState} from "../../reducers/app.state";
import {Store} from "@ngrx/store";
import * as sideB from "../../actions/side-B.action";


@Component({
  selector: "app-swap-container",
  templateUrl: "./swap-container.component.html",
  styleUrls: ["./swap-container.component.scss"]
})
export class SwapContainerComponent implements OnInit {
  displayedColumns = ["from", "to"];
  dataSource;

  constructor(private store: Store<AppState>, public orderService: OrderService) {
    this.dataSource = new OrderDataSource(orderService);
  }

  ngOnInit() {
  }

  onRowClick(obj) {
    this.store.dispatch(new sideB.InitiateAction(obj));
  }
}

export interface Element {
  from: string;
  to: string;
  id: number;
  fromAmount: number;
  toAmount: number;
}

export class OrderDataSource extends DataSource<any> {

  // TODO: Remove preserved for testing purposes
  ELEMENT_DATA: Element[] = [
    {id: 1, from: "BTC", to: "ETC", fromAmount: 1, toAmount: 3},
    {id: 1, from: "BTC", to: "ETC", fromAmount: 1, toAmount: 3},
    {id: 1, from: "BTC", to: "ETC", fromAmount: 1, toAmount: 3},
    {id: 1, from: "BTC", to: "ETC", fromAmount: 1, toAmount: 3},
    {id: 1, from: "BTC", to: "ETC", fromAmount: 1, toAmount: 3},
  ];

  constructor(private orderService: OrderService) {
    super();
  }

  connect(): Observable<Element[]> {
    return this.orderService.getActiveOrders();
    // return Observable.of(this.ELEMENT_DATA);
  }

  disconnect() {
  }
}
