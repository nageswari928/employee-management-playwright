export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.editButton = page.getByTestId('edit-profile-btn');
    this.saveButton = page.getByTestId('save-profile-btn');
    this.cancelButton = page.getByTestId('cancel-profile-btn');
    this.nameInput = page.getByTestId('profile-name');
    this.emailInput = page.getByTestId('profile-email');
    this.phoneInput = page.getByTestId('profile-phone');
    this.departmentInput = page.getByTestId('profile-department');
    this.roleInput = page.getByTestId('profile-role');
    this.joiningDateInput = page.getByTestId('profile-joining-date');
    this.addressInput = page.getByTestId('profile-address');
    this.skillsInput = page.getByTestId('profile-skills');
    this.message = page.locator('#profileMessage');
  }

  async open() {
    await this.page.goto('/profile.html');
  }

  async editProfile() {
    await this.editButton.click();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
