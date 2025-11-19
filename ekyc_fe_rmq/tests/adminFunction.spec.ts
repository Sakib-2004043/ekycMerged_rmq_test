import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('heading', { name: 'Welcome to the Landing Page' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sakib1514817122@gmail.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('sakib338');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Admin Dashboard' }).click();
  await page.getByRole('button', { name: 'View' }).first().click();
  await page.getByRole('heading', { name: 'AI Description' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Go' }).first().click();
  await page.locator('body').press('ControlOrMeta+Shift+I');
  await page.goto('http://localhost:3000/admin');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PDF' }).first().click();
  const download = await downloadPromise;
  await page.getByRole('heading', { name: 'Admin Dashboard' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'KYC Login' }).click();
});