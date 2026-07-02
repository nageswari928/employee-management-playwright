export class NotificationsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByTestId('notification-search');
    this.filterSelect = page.getByTestId('notification-filter');
    this.list = page.locator('#notificationsList');
  }

  async open() {
    await this.page.goto('/notifications.html');
  }

  async search(value) {
    await this.searchInput.fill(value);
  }

  async filter(value) {
    await this.filterSelect.selectOption(value);
  }
}
