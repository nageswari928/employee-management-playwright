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

test('TC015 - Employees page loads and renders table', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await expect(employeesPage.table).toBeVisible();
  await expect(page.getByText('Employee Directory')).toBeVisible();
});

test('TC016 - Employees search filters results', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.search('Ava');
  await expect(page.getByText('Ava Martinez')).toBeVisible();
});

test('TC017 - Employees department filter changes results', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.filterByDepartment('Engineering');
  await expect(page.getByText('Engineering')).toBeVisible();
});

test('TC018 - Employees status filter changes results', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.filterByStatus('Active');
  await expect(page.getByText('Active')).toBeVisible();
});

test('TC019 - Employees sort select is functional', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.sortBy('department');
  await expect(employeesPage.table).toBeVisible();
});

test('TC020 - Employee details modal opens', async ({ page }) => {
  await login(page);
  const employeesPage = new EmployeesPage(page);
  await employeesPage.open();
  await employeesPage.openFirstEmployeeDetails();
  await expect(employeesPage.modal).toBeVisible();
});

test('TC021 - Profile page opens and edit controls are available', async ({ page }) => {
  await login(page);
  const profilePage = new ProfilePage(page);
  await profilePage.open();
  await expect(profilePage.editButton).toBeVisible();
  await expect(profilePage.saveButton).toBeHidden();
});

test('TC022 - Profile edit mode toggles correctly', async ({ page }) => {
  await login(page);
  const profilePage = new ProfilePage(page);
  await profilePage.open();
  await profilePage.editProfile();
  await expect(profilePage.saveButton).toBeVisible();
  await expect(profilePage.cancelButton).toBeVisible();
});

test('TC023 - Settings page displays preference controls', async ({ page }) => {
  await login(page);
  const settingsPage = new SettingsPage(page);
  await settingsPage.open();
  await expect(settingsPage.themeSelect).toBeVisible();
  await expect(settingsPage.languageSelect).toBeVisible();
  await expect(settingsPage.notificationToggle).toBeVisible();
  await expect(settingsPage.autoLogoutToggle).toBeVisible();
});

test('TC024 - Settings save action completes', async ({ page }) => {
  await login(page);
  const settingsPage = new SettingsPage(page);
  await settingsPage.open();
  await settingsPage.save();
  await expect(settingsPage.message).toContainText(/saved|success/i);
});

test('TC025 - Notifications page loads and supports search', async ({ page }) => {
  await login(page);
  const notificationsPage = new NotificationsPage(page);
  await notificationsPage.open();
  await notificationsPage.search('policy');
  await expect(notificationsPage.list).toBeVisible();
});

test('TC026 - Notifications filter changes results', async ({ page }) => {
  await login(page);
  const notificationsPage = new NotificationsPage(page);
  await notificationsPage.open();
  await notificationsPage.filter('unread');
  await expect(notificationsPage.list).toBeVisible();
});

test('TC027 - About page shows portal information', async ({ page }) => {
  await login(page);
  await page.goto('/about.html');
  await expect(page.getByText('Northstar Holdings')).toBeVisible();
  await expect(page.getByText('Portal Version')).toBeVisible();
});

test('TC028 - Logout button is present on all app pages', async ({ page }) => {
  await login(page);
  await page.goto('/employees.html');
  await expect(page.getByTestId('logout-btn')).toBeVisible();
  await page.goto('/profile.html');
  await expect(page.getByTestId('logout-btn')).toBeVisible();
  await page.goto('/settings.html');
  await expect(page.getByTestId('logout-btn')).toBeVisible();
});

test('TC029 - About page navigation link opens the company overview', async ({ page }) => {
  await login(page);
  await page.getByTestId('nav-about').click();
  await expect(page).toHaveURL(/about.html/);
  await expect(page.getByText('Portal Version')).toBeVisible();
});

test('TC030 - Dashboard shows notification badge and latest notification content', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('notification-btn')).toBeVisible();
  await expect(page.getByText('Latest Notifications')).toBeVisible();
});
