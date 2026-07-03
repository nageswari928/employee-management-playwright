export class EmployeesPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByTestId('employee-search');
    this.departmentFilter = page.getByTestId('department-filter');
    this.statusFilter = page.getByTestId('status-filter');
    this.sortSelect = page.getByTestId('sort-select');
    this.employeeTable = page.locator('#employeeTable').locator('table');
    this.modal = page.locator('#employeeModal');
    this.closeModalButton = page.getByTestId('close-employee-modal');
  }

  async open() {
    await this.page.goto('/employees.html');
    await this.page.waitForLoadState("networkidle");
  }

  async search(value) {
    await this.searchInput.fill(value);
  }

  async filterByDepartment(department) {
    await this.departmentFilter.selectOption(department);
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
  }

  async sortBy(option) {
    await this.sortSelect.selectOption(option);
  }

  async openFirstEmployeeDetails() {
    await this.page.getByRole('button', { name: 'View' }).first().click();
  }
}
