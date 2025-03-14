from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup WebDriver (Ensure chromedriver is in PATH)
driver = webdriver.Chrome()

# Open the target webpage
driver.get("https://bintariq.store/")

# Wait for the page to load fully
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

# Function to extract background images from elements with a given class
def get_background_images(class_name):
    elements = driver.find_elements(By.CLASS_NAME, class_name)
    image_urls = []

    for element in elements:
        bg_image = element.value_of_css_property("background-image")
        if 'url(' in bg_image:
            url = bg_image.split('url(')[1].split(')')[0].strip('"').strip("'")
            image_urls.append(url)

    return image_urls

# Alternative method: Extract from elements with inline styles containing "background-image"
def get_background_images_from_styles():
    elements = driver.find_elements(By.XPATH, "//*[contains(@style, 'background-image')]")
    image_urls = []

    for element in elements:
        bg_image = element.value_of_css_property("background-image")
        if 'url(' in bg_image:
            url = bg_image.split('url(')[1].split(')')[0].strip('"').strip("'")
            image_urls.append(url)

    return image_urls

class_name = "background-overlay"
image_urls = get_background_images(class_name)

if not image_urls:  # If no images found, try the alternative method
    image_urls = get_background_images_from_styles()

# Print the extracted image URLs
for url in image_urls:
    print(url)

time.sleep(5)  # Optional delay
driver.quit()
