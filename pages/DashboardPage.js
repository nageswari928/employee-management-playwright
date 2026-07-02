export class DashboardPage {

    constructor(page){

        this.page = page;

        this.logoutButton = page.getByTestId("logout-btn");

        this.logoutModal = page.locator("#logoutModal");

        this.confirmLogoutButton = page.getByTestId("confirm-logout");

        this.cancelLogoutButton = page.getByTestId("cancel-logout");

    }

    async logout(){

        await this.logoutButton.click();

        await this.confirmLogoutButton.click();

    }
    async clickLogout() {
        await this.logoutButton.click();
    }

    async confirmLogout() {
        await this.confirmLogoutButton.click();
    }

    async cancelLogout() {
        await this.cancelLogoutButton.click();
    }

}