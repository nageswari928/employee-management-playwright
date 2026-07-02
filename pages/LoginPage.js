export class LoginPage {

    constructor(page) {
        this.page = page;

        this.employeeId = page.getByTestId('employee-id');

        this.password = page.getByTestId('password');

        this.loginButton = page.getByTestId('login-btn');

        this.loginMessage = page.getByTestId('login-message');

        this.rememberMeCheckbox = page.getByTestId('remember-me');

        this.togglePasswordButton = page.getByTestId('toggle-password');

    }

    async open() {
        await this.page.goto('/login.html');
    }

    async login(employeeId, password) {

        await this.employeeId.fill(employeeId);

        await this.password.fill(password);

        await this.loginButton.click();

    }
    async reset() {
        await this.page.getByTestId('reset-btn').click();
    }
    
    async togglePassword() {
        await this.togglePasswordButton.click();
    }

    async rememberMe() {
        await this.page.getByTestId('remember-me').check();
    }
}