import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import * as sideA from "../../actions/side-A.action";
import * as swapAction from "../../actions/start.action";
import {flyInOutAnimation} from "../../animations/animations";
import {AnimationEnabledComponent} from "../../common/animation.component";
import {Coin, CoinFactory} from "../../models/coins/coin.model";
import {MessageTypes} from "../../models/message-types.enum";
import {SwapProcess} from "../../models/swap-process.model";
import * as quoteSelector from "../../selectors/quote.selector";
import * as swapSelector from "../../selectors/start.selector";
import {MatDialog} from "@angular/material";
import {AllCoinsDialogComponent} from "../../common/coins-dialog/all-coins.dialog";
import {AppState} from "../../reducers/app.state";
import {Observable} from "rxjs/Observable";

@Component({
  selector: "app-swap-start",
  templateUrl: "./swap-start.component.html",
  styleUrls: ["./swap-start.component.scss"],
  animations: [flyInOutAnimation],
  preserveWhitespaces: false
})
export class SwapStartComponent extends AnimationEnabledComponent implements OnInit {
  scrollbarConfig: Object = {suppressScrollY: true};
  infoMsg: string;
  messageTypes: typeof MessageTypes = MessageTypes;
  selectedCoin: Coin;
  coinToChange: string;
  coins: Array<Coin>;
  $swapProcess: Observable<SwapProcess>;
  $depositCoin: Observable<Coin>;
  $receiveCoin: Observable<Coin>;

  $quote: Observable<number>;
  $depositUSD: Observable<number>;
  $receiveUSD: Observable<number>;

  constructor(private store: Store<AppState>, public dialog: MatDialog) {
    super();
    this.infoMsg = "For testnet use only";
    this.coins = CoinFactory.createAllCoins();

    this.store.dispatch(new swapAction.SetActiveStepAction(1));
    this.$swapProcess = this.store.select(swapSelector.getSwapProcess);
    this.$depositCoin = this.store.select(swapSelector.getDepositCoin);
    this.$receiveCoin = this.store.select(swapSelector.getReceiveCoin);

    const quotes = this.store.select(quoteSelector.getQuotes);

    this.$quote = Observable.combineLatest(
      this.$depositCoin, this.$receiveCoin, quotes, (coin, receive, qq) => {
        if (!qq) {
          return undefined;
        }

        const depositAmount = +coin.amount;
        const depositQuotes = qq.get(coin.name);
        const receiveQuotes = qq.get(receive.name);

        const number = ((depositAmount * depositQuotes.price) / receiveQuotes.price);
        const price = +number.toFixed(8);
        if (isNaN(number)) {
          return 0;
        }
        return price;
      }
    );

    this.$depositUSD = Observable.combineLatest(
      this.$depositCoin, this.$receiveCoin, quotes, (coin, receive, q) => {
        if (!q) {
          return undefined;
        }
        const depositAmount = coin.amount;
        const depositQuotes = q.get(coin.name);
        // console.log('deposit quotes', depositQuotes);
        const number = depositAmount * depositQuotes.price;
        const price = +number.toFixed(2);
        if (isNaN(number)) {
          return 0;
        }
        return price;
      }
    );

    // mock receive usd value with 1% fee
    this.$receiveUSD = Observable.combineLatest(
      this.$quote, this.$receiveCoin, quotes, (receiveCoinVal, receive, q) => {
        if (!q) {
          return undefined;
        }

        const depositAmount = receiveCoinVal;
        const depositQuotes = q.get(receive.name);

        let number = depositAmount * depositQuotes.price;
        number = number - (0.01 * number); // TODO artifical fee ??
        const price = +number.toFixed(2);
        if (isNaN(number)) {
          return 0;
        }
        return price;
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }


  swapDepositRecieveCoins() {
    this.store.dispatch(new swapAction.SwapDepositReceiveCoinsAction());
  }

  onSwap(data) {
    this.formFlyOut();
    setTimeout(() => {
      this.store.dispatch(new sideA.GenerateLinkAction(data));
    }, 500);
  }

  onDepositChange(depositamount: number) {
    this.store.dispatch(new swapAction.SetDepositAmountAction(depositamount));
  }

  changeDepositCoin(coin: Coin) {
    this.showAllCoins(coin);
    this.coinToChange = "deposit";
  }

  changeReceiveCoin(coin: Coin) {
    this.showAllCoins(coin);
    this.coinToChange = "receive";
  }

  showAllCoins(coin) {
    const dialogRef = this.dialog.open(AllCoinsDialogComponent, {
      panelClass: "all-coins-dialog",
      data: {coins: this.coins, selectedCoin: coin}
    });

    dialogRef.afterClosed().filter(res => !!res).subscribe(result => {
      if (result.amount === 0) {
        setTimeout(() => {
          this.chooseCoin(result);
        });
        return;
      }
      this.chooseCoin(result);
    });
  }

  chooseCoin(coin) {
    if (this.coinToChange == "deposit")
      this.store.dispatch(new swapAction.setDepositCoinAction(coin));
    else
      this.store.dispatch(new swapAction.setReceiveCoinAction(coin));
  }

}
