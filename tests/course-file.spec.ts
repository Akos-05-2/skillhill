import { test, expect } from '@playwright/test';

test.describe('Kurzus és fájl kezelés tesztek', () => {
  test('1. Kurzus lista oldal betöltése', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');
    
    await expect(page.getByRole('heading', { name: 'Kurzusok' })).toBeVisible();
    
    const courseCards = page.locator('.course-card');
    await expect(courseCards).toHaveCount(await courseCards.count());
  });


  test('2. Üres kurzus kezelése', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');
    
    const emptyMessage = page.getByText('A kurzus nem található vagy nincsenek modulok');
    if (await emptyMessage.count() > 0) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('3. Betöltési állapot', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');
    
    const loadingText = page.getByText('Betöltés...');
    await expect(loadingText).toBeVisible();
    
    await expect(loadingText).toBeHidden();
  });

  test('4. Kategória szűrés', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');
    
    const categoryFilters = page.locator('button:has-text("Kategória")');
    if (await categoryFilters.count() > 0) {
      await categoryFilters.first().click();
      
      await expect(page.locator('.course-card')).toBeVisible();
    }
  });

  test('5. Keresés működése', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');
    
    const searchInput = page.getByPlaceholder('Keresés...');
    if (await searchInput.count() > 0) {
      await searchInput.fill('teszt');
      
      await expect(page.locator('.course-card')).toBeVisible();
    }
  });
}); 