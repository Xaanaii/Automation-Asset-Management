import { test } from '@playwright/test';
import { setAllureMeta } from '../helper/allureHelper';
import { users } from '../data/credentials';

// 🔹 Page Objects
import { LoginPage } from '../Flow Bidder/loginPage';
import { DashboardPage } from '../Flow Bidder/dashboardPage';
import { TekminPage } from '../Flow Bidder/tekminPage';
import { AmuPage } from '../Flow Bidder/amuPage';
import { DirekturPage } from '../Flow Bidder/direkturPage';
import { DirutPage } from '../Flow Bidder/dirutPage';
import { WoJual } from '../Flow Bidder/woJual';
import { UTNJual } from '../Flow Bidder/utnJual';
import { CancelRevoke } from '../Flow Bidder/cancelRevoke';

// 🔹 Balai Lelang
import { TransitUTN } from '../Flow Auction/BalaiLelang';
import { ReleasePPK } from '../Flow Auction/releasePPK';
import { PendingHDLHO } from '../Flow Auction/pendingHDL-HO';
import { AuctionDirektur } from '../Flow Auction/AuctionDirektur';

// 🔹 SMMF ONE
import { LoginPageHRD } from '../SMMF ONE/loginPageHRD';
import { ResetImei } from '../SMMF ONE/resetImei';
import { WoUnitDate } from '../SMMF ONE/woUnitDate';

let createPpkSuccess = false;

test.describe('📦 Flow Bidder', () => {
  test.beforeAll(() => {
    setAllureMeta({ feature: 'Asset Management' });
  });

  // ==========================================================
  // 1️⃣ CREATE PPK (CC1)
  // ==========================================================
  test('Create PPK from CC1', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    try {
      await login.gotoLoginPage();
      await login.login(users.cckrw1.username, users.cckrw1.password);
      await dashboard.navigateToAssetManagementUTN();
      createPpkSuccess = true;
      console.log('✅ Create PPK success');
    } catch (error) {
      createPpkSuccess = false;
      console.error('❌ Create PPK failed:', error);
      throw error;
    }
  });


  // ==========================================================
  // 3️⃣ APPROVAL FLOW
  // ==========================================================
  test('Approve PPK by Tekmin', async ({ page }) => {
    const login = new LoginPage(page);
    const tekmin = new TekminPage(page);

    await login.gotoLoginPage();
    await login.login(users.tekmin.username, users.tekmin.password);
    await tekmin.navigateToTekmin();
  });

  test('Approve PPK by AMU', async ({ page }) => {
    const login = new LoginPage(page);
    const amu = new AmuPage(page);

    await login.gotoLoginPage();
    await login.login(users.AMU.username, users.AMU.password);
    await amu.navigateToAmu();
  });

  test('Approve PPK by Direktur Finance Accounting', async ({ page }) => {
    const login = new LoginPage(page);
    const direktur = new DirekturPage(page);

    await login.gotoLoginPage();
    await login.login(users.direktur.username, users.direktur.password);
    await direktur.navigateToDirektur();
  });

  test('Approve PPK by Direktur Utama', async ({ page }) => {
    const login = new LoginPage(page);
    const dirut = new DirutPage(page);

    await login.gotoLoginPage();
    await login.login(users.dirut.username, users.dirut.password);
    await dirut.navigateToDirut();
  });

  
});

test.describe('📦 Flow Auction', () => {
  test.beforeAll(() => {
    setAllureMeta({ feature: 'Asset Management' });
  });

  // ==========================================================
  // 4️⃣ PENYELESAIAN FLOW
  // ==========================================================
  test('Penyelesaian WO Jual', async ({ page }) => {
    const login = new LoginPage(page);
    const woJual = new WoJual(page);

    await login.gotoLoginPage();
    await login.login(users.ccbdg1.username, users.ccbdg1.password);
    await woJual.navigateToWoJual();
  });

  test('Penyelesaian UTN Jual', async ({ page }) => {
    const login = new LoginPage(page);
    const utnJual = new UTNJual(page);

    await login.gotoLoginPage();
    await login.login(users.ccbdg1.username, users.ccbdg1.password);
    await utnJual.navigateToUTNJual();
  });

  // ==========================================================
  // 5️⃣ CANCEL / REVOKE FLOW
  // ==========================================================
  test('Cancel Revoke', async ({ page }) => {
    const login = new LoginPage(page);
    const cancelRevoke = new CancelRevoke(page);

    await login.gotoLoginPage();
    await login.login(users.accpusat.username, users.accpusat.password);
    await cancelRevoke.navigateToCancelRevoke();
  });

  // ==========================================================
  // 6️⃣ Auction FLOW
  // ==========================================================
  test('Balai Lelang', async ({ page }) => {
    const login = new LoginPage(page);
    const transitUTN = new TransitUTN(page);

    await login.gotoLoginPage();
    await login.login(users.ccbdg1.username, users.ccbdg1.password);
    await transitUTN.navigateToTransitUTN();
  });

  test('Release PPK Tekmin', async ({ page }) => {
    const login = new LoginPage(page);
    const releasePPK = new ReleasePPK(page);

    await login.gotoLoginPage();
    await login.login(users.tekmin.username, users.tekmin.password);
    await releasePPK.navigateToReleasePPK();
  });

  test('Pending HDL-HO', async ({ page }) => {
    const login = new LoginPage(page);
    const pendingHDLHO = new PendingHDLHO(page);

    await login.gotoLoginPage();
    await login.login(users.ccbdg1.username, users.ccbdg1.password);
    await pendingHDLHO.navigateToPendingHDLHO();
  });

  test('Approve Auction Direktur', async ({ page }) => {
    const login = new LoginPage(page);
    const auctionDirektur = new AuctionDirektur(page);

    await login.gotoLoginPage();
    await login.login(users.direktur.username, users.direktur.password);
    await auctionDirektur.navigateToAuctionDirektur();
  });
});

test.describe('📦 Asset Management SMMF ONE Workflow', () => {
  test.beforeAll(() => {
    setAllureMeta({ feature: 'Asset Management Mobile dan web' });
  });

  
  // ==========================================================
  // 2️⃣ RESET IMEI (HRD / Tekmin)
  // ==========================================================
  test('Reset Imei', async ({ page }) => {
    const login = new LoginPageHRD(page);
    const hrd = new ResetImei(page);

    await login.gotoLoginPage();
    await login.loginHRD(users.admin.username, users.admin.password);
    await hrd.navigateToResetImei();
  });

  // ==========================================================
  // wo-unit date
  // ==========================================================
  test('Wo Unit Date', async ({ page }) => {
    const login = new LoginPage(page);
    const woUnitDate = new WoUnitDate(page);

    await login.gotoLoginPage();
    await login.login(users.ccbdg1.username, users.ccbdg1.password);
    await woUnitDate.navigateToWoUnitDate();
  });

});