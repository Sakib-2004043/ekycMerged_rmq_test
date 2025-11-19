import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('heading', { name: 'Welcome to the Landing Page' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sakib15148@gmail.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('sakib889');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Welcome to User Dashboard' }).click();
  await page.getByText('This is the landing page for').click();
});