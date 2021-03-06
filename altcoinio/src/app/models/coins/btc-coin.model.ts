import {Coin} from "./coin.model";
import {Coins} from "./coins.enum";
import {Observable} from "rxjs/Observable";
import {WalletRecord} from "../../reducers/balance.reducer";
import {AltcoinioStorage} from "../../common/altcoinio-storage";

export class BtcCoinModel implements Coin {
  readonly derive: undefined;
  readonly type = Coins.BTC;
  readonly name: string = Coins[Coins.BTC].toString();
  readonly fullName: string = "Bitcoin";
  readonly icon: string = "assets/icon/btc-icon.png";
  amount;
  faucetLoading = false;
  $balanceUSD: Observable<number>;
  walletRecord: WalletRecord;

  constructor() {
  }

  update(coin: BtcCoinModel): BtcCoinModel {
    const model = new BtcCoinModel();
    model.amount = coin ? coin.amount : 0;
    return model;
  }

  transferTo(to: string, value: number) {
    throw new Error('Not implemented');
  }
}
