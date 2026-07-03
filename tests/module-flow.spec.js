import { test, expect } from '../fixtures/playwright-fixture.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { EmployeesPage } from '../pages/EmployeesPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { NotificationsPage } from '../pages/NotificationsPage.js';
import { loginData } from '../test-data/loginData.js';

const login = async (page) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(loginData.validUser.employeeId, loginData.validUser.password);
  await expect(page).toHaveURL(/dashboard.html/);
   // Wait until dashboard is completely loaded
  await page.waitForLoadState("networkidle");
};

test('TC013 - Dashboard navigation items are visible', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('nav-dashboard')).toBeVisible();
  await expect(page.getByTestId('nav-employees')).toBeVisible();
  await expect(page.getByTestId('nav-profile')).toBeVisible();
  await expect(page.getByTestId('nav-settings')).toBeVisible();
  await expect(page.getByTestId('nav-notifications')).toBeVisible();
  await expect(page.getByTestId('nav-about')).toBeVisible();
});

test('TC014 - Dashboard cards render', async ({ page }) => {
  await login(page);
  const cards = page.getByTestId('dashboard-card');
  await expect(cards).toHaveCount(4);
});

test('TC015 - Employees search filters results', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.search('Ava');
  await expect(
    employeesPage.employeeTable
  ).toContainText("Ava Martinez");
});

test('TC016 - Employees department filter changes results', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.filterByDepartment('Engineering');
  await expect(
    employeesPage.employeeTable
   ).toContainText("Engineering");
});

test('TC017 - Employees status filter changes results', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.filterByStatus('Active');
  await expect(
    employeesPage.employeeTable
  ).toContainText("Active");
});

test('TC018 - Employee details modal opens', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.openFirstEmployeeDetails();
  await expect(employeesPage.modal).toBeVisible();
});

test('TC019 - Profile page opens and edit controls are available', async ({ page }) => {
  await login(page);
  const profilePage = new ProfilePage(page);
  await profilePage.open();
  await expect(profilePage.editButton).toBeVisible();
  await expect(profilePage.saveButton).toBeHidden();
});

test('TC020 - Profile edit mode toggles correctly', async ({ page }) => {
  await login(page);
  const profilePage = new ProfilePage(page);
  await profilePage.open();
  await profilePage.editProfile();
  await expect(profilePage.saveButton).toBeVisible();
  await expect(profilePage.cancelButton).toBeVisible();
});

test('TC021 - Settings page displays preference controls', async ({ page }) => {
  await login(page);
  const settingsPage = new SettingsPage(page);
  await settingsPage.open();
  await expect(settingsPage.themeSelect).toBeVisible();
  await expect(settingsPage.languageSelect).toBeVisible();
  await expect(settingsPage.notificationToggle).toBeVisible();
  await expect(settingsPage.autoLogoutToggle).toBeVisible();
});

test('TC022 - Settings save action completes', async ({ page }) => {
  await login(page);
  const settingsPage = new SettingsPage(page);
  await settingsPage.open();
  await settingsPage.save();
  await expect(settingsPage.message).toContainText(/saved|success/i);
});

test('TC023 - Notifications page loads and supports search', async ({ page }) => {
  await login(page);
  const notificationsPage = new NotificationsPage(page);
  await notificationsPage.open();
  await notificationsPage.search('policy');
  await expect(notificationsPage.list).toBeVisible();
});
