# Curatio Google Apps Script setup

## 1. Create the Google Sheet
1. Open Google Sheets and create a new spreadsheet.
2. Rename the first sheet tab to `Submissions`.
3. Optionally rename the spreadsheet to `Curatio Enquiries`.

## 2. Open Apps Script
1. In the Google Sheet, choose `Extensions` → `Apps Script`.
2. Delete any starter code in the editor.
3. Paste the contents of `curatio-form-webapp.gs`.

## 3. Set the studio notification email
1. In `curatio-form-webapp.gs`, replace `studio@example.com` with the email address that should receive the notification.

## 4. Deploy as a Web App
1. Click `Deploy` → `New deployment`.
2. Choose `Web app` as the deployment type.
3. Under `Description`, add something like `Curatio questionnaire endpoint`.
4. Set `Execute as` to `Me`.
5. Set `Who has access` to `Anyone` or `Anyone with the link`.
6. Click `Deploy`.
7. Copy the Web App URL from the deployment dialog.

## 5. Paste the Web App URL into the app
1. Open `components/CuratioQuestionnaire.tsx`.
2. Replace the placeholder in `APPS_SCRIPT_URL` with the URL you copied.

## 6. File upload note
The app supports selecting up to 5 inspiration files and records their names in the sheet. Actual file contents are not uploaded through this JSON endpoint yet.

## 7. Permissions explanation
- `Execute as Me` means the script uses your account credentials to write to the sheet and send email.
- `Anyone with the link` lets the form send data without requiring viewers to sign in.
- The script only accepts POST requests and does not expose your Google account.
