package com.smileguard.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.time.Duration;

public class DriverFactory {
    
    public static WebDriver createDriver() {
        System.out.println("🚀 Initializing WebDriver via WebDriverManager...");
        
        // Auto-download and setup the correct version of ChromeDriver
        WebDriverManager.chromedriver().setup();
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--headless=new"); // Headless mode for clean execution in the environment
        options.addArguments("--window-size=1280,1024");
        
        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        
        System.out.println("✅ WebDriver initialized successfully.");
        return driver;
    }
}
