package com.smileguard.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private final By getStartedButton = By.xpath("//*[contains(text(),'Get Started')]");
    private final By emailInput = By.xpath("//input[contains(@placeholder,'Email') or @type='email']");
    private final By passwordInput = By.xpath("//input[contains(@placeholder,'Password') or @type='password']");
    private final By loginSubmitButton = By.xpath("//button[contains(.,'Login') or contains(.,'Sign In') or @type='submit']");
    private final By logoutButton = By.xpath("//*[contains(text(),'Logout') or contains(text(),'Sign Out')]");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void navigateToLogin(String url) {
        driver.get(url);
        try {
            if (isDisplayed(getStartedButton)) {
                click(getStartedButton);
            }
        } catch (Exception e) {
            // Already on login page or get started not visible
        }
    }

    public void login(String email, String password) {
        type(emailInput, email);
        type(passwordInput, password);
        click(loginSubmitButton);
    }

    public boolean isLoggedIn() {
        return isDisplayed(logoutButton);
    }
}
