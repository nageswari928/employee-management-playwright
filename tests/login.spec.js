import { test, expect } from '../fixtures/playwright-fixture.js';
import { LoginPage } from '../pages/LoginPage.js';
import { loginData } from "../test-data/loginData.js";
import {DashboardPage} from "../pages/DashboardPage.js";

let loginPage;

test.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);

    await loginPage.open();

});

// test('TC001 - Valid Login', async ({ page }) => {

//     await loginPage.login(
//         loginData.validUser.employeeId,
//         loginData.validUser.password
//     );

//     await expect(
//       page.getByTestId("dashboard")
//     ).toBeVisible();
// });

// test('TC002 - Invalid Password', async () => {

//     await loginPage.login(
//         loginData.invalidPassword.employeeId,
//         loginData.invalidPassword.password
//     );

//     await expect(loginPage.loginMessage)
//         .toContainText(
//             'Invalid Employee ID or Password'
//         );

// });

// test('TC003 - Invalid Employee ID', async () => {

//     await loginPage.login(
//         loginData.invalidEmployee.employeeId,
//         loginData.invalidEmployee.password
//     );
// });

// test('TC004 - emptyEmployee', async () => {

//     await loginPage.login(
//         loginData.emptyEmployee.employeeId,
//         loginData.emptyEmployee.password
//     );
// });

// test('TC005 - emptyPassword', async () => {
    
//     await loginPage.login(
//         loginData.emptyPassword.employeeId,
//         loginData.emptyPassword.password
//     );
    
// });

// test('TC006 - emptyFields', async () => {
//     await loginPage.login(
//         loginData.emptyFields.employeeId,
//         loginData.emptyFields.password
//     );
// });

// test('TC007 - Reset Form', async ({ loginPage }) => {

//     await loginPage.employeeId.fill("EMP001");

//     await loginPage.password.fill("Password123");

//     await loginPage.reset();

//     await expect(loginPage.employeeId)
//         .toHaveValue("");

//     await expect(loginPage.password)
//         .toHaveValue("");

// });

test('TC008 - Show Password', async ({ loginPage }) => {

    await loginPage.togglePassword();

    await expect(loginPage.password)
        .toHaveAttribute(
            "type",
            "text"
        );

});

test('TC009 - Remember Me', async ({ loginPage }) => {

    await loginPage.rememberMe();

    await expect(
        loginPage.page
            .getByTestId("remember-me")
    ).toBeChecked();

});

test('TC010 - Verify Successful Logout', async ({ page }) => {

    const dashboardPage = new DashboardPage(page);

    await loginPage.open();

    await loginPage.login(
        loginData.validUser.employeeId,
        loginData.validUser.password
    );

    await expect(page).toHaveURL(/dashboard.html/);

    await dashboardPage.logout();

    await expect(page).toHaveURL(/login.html/);

    await expect(loginPage.employeeId).toBeVisible();

    await expect(loginPage.password).toBeVisible();

});

test('TC011 - Verify Cancel Logout', async ({ page }) => {

    const dashboardPage = new DashboardPage(page);

    await loginPage.open();

    await loginPage.login(
        loginData.validUser.employeeId,
        loginData.validUser.password
    );

    await dashboardPage.clickLogout();

    await expect(dashboardPage.logoutModal)
        .toBeVisible();

    await dashboardPage.cancelLogout();

    await expect(dashboardPage.logoutModal)
        .toBeHidden();

    await expect(page)
        .toHaveURL(/dashboard.html/);

});

test('TC012 - Verify Logout Confirmation Popup', async ({ page }) => {

    const dashboardPage = new DashboardPage(page);

    await loginPage.open();

    await loginPage.login(
        loginData.validUser.employeeId,
        loginData.validUser.password
    );

    await dashboardPage.clickLogout();

    await expect(dashboardPage.logoutModal)
        .toBeVisible();

    await expect(dashboardPage.confirmLogoutButton)
        .toBeVisible();

    await expect(dashboardPage.cancelLogoutButton)
        .toBeVisible();

});