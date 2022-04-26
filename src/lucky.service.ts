import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  LCAddress,
  MIN_LC_COMPOUND,
  MIN_STAKING_WALLET_BALANCE,
} from './consts';
import { WalletService } from './wallet.service';
import { ConfigService } from './config.service';

@Injectable()
export class LuckyService {
  constructor(
    private readonly walletService: WalletService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 */3 * * * *')
  async handleCron() {
    if (!this.configService.getIsRunning()) {
      return;
    }
    console.log('--------Cron is running');
    const isPaused = await this.walletService.isTablePaused();
    console.log('isPaused: ', isPaused);
    // do cron only when the lc dice table is paused
    if (!isPaused) {
      return;
    }
    const { address } = this.walletService.getStakingWallet();

    const lcBalance = await WalletService.getTokenBalance(address, LCAddress);
    console.log('LC Balance = ', lcBalance.toString());
    if (lcBalance.gte(MIN_LC_COMPOUND)) {
      console.log('LC Banked Starting: ', new Date().toISOString());
      await this.walletService.bankLC();
      await this.walletService.stakeLuckyLC();
      console.log('LC Banked Ending: ', new Date().toISOString());
      return;
    }

    const pendingLC = await this.walletService.getPendingLC(address);

    // do nothing when the pending lc reward is small
    if (pendingLC.lt(MIN_LC_COMPOUND)) {
      return;
    }

    // harvest lc reward
    await this.walletService.harvestLC();
    const stakingBalance = await this.walletService.getWalletBalance(address);
    if (stakingBalance.lt(MIN_STAKING_WALLET_BALANCE)) {
      console.log('Swapped BNB for Gas Starting: ', new Date().toISOString());
      await this.walletService.swapLCToBNB();
      console.log('Swapped BNB for Gas Ending: ', new Date().toISOString());
    } else {
      console.log('Staked LuckyLC Starting: ', new Date().toISOString());
      await this.walletService.bankLC();
      await this.walletService.stakeLuckyLC();
      console.log('Staked LuckyLC Ending: ', new Date().toISOString());
    }
  }
}
