package com.smileguard.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {

    private final By dashboardTab = By.xpath("//*[text()='Dashboard' or contains(text(),'Dashboard')]");
    private final By uploadScanTab = By.xpath("//*[text()='Upload Scan' or contains(text(),'Upload Scan')]");
    private final By predictionsTab = By.xpath("//*[text()='Predictions' or contains(text(),'Predictions')]");
    private final By findDentistTab = By.xpath("//*[text()='Find Dentist' or contains(text(),'Find Dentist') or contains(text(),'Find a Dentist')]");
    private final By profileTab = By.xpath("//*[text()='Profile' or contains(text(),'Profile')]");
    private final By logoutTab = By.xpath("//*[text()='Logout' or contains(text(),'Logout')]");
    private final By headerTitle = By.xpath("//*[contains(text(),'CURRENT ORAL HEALTH STATUS') or contains(text(),'Dashboard')]");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public boolean isDashboardLoaded() {
        return isDisplayed(headerTitle);
    }

    public void clickDashboard() {
        click(dashboardTab);
    }

    public void clickUploadScan() {
        click(uploadScanTab);
    }

    public void clickPredictions() {
        click(predictionsTab);
    }

    public void clickFindDentist() {
        click(findDentistTab);
    }

    public void clickProfile() {
        click(profileTab);
    }

    public void clickLogout() {
        click(logoutTab);
    }
}
