export class SettingsPage {
  constructor(page) {
    this.page = page;
    this.themeSelect = page.getByTestId('theme-toggle');
    this.languageSelect = page.getByTestId('language-select');
    this.notificationToggle = page.getByTestId('notification-toggle');
    this.autoLogoutToggle = page.getByTestId('auto-logout-toggle');
    this.saveButton = page.getByTestId('save-settings-btn');
    this.resetButton = page.getByTestId('reset-settings-btn');
    this.message = page.locator('#settingsMessage');
  }

  async open() {
    await this.page.goto('/settings.html');
  }

  async save() {
    await this.saveButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }
}
