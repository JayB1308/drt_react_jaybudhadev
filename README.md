# Digantara Assignment | React | Jay Budhadev

## Prerequisites
- Make sure you have node version of **18** or greater

## Installation
- Clone the repo on your computer
- Go into the cloned directory using your terminal
- Run `npm install` and then run `npm run dev` on your terminal
- You should see some output on the terminal indicating the port on which the app is running
- By default it will be running on `PORT 5173`, but it will change if that particular port is not available
- Click on the link shown in the terminal, or visit `http://localhost:5173` on your browser to view the app.

## Features implemented
### Filtering
You can filter the data using the dropdowns shown in the top section of the screen.

![image](https://github.com/user-attachments/assets/126d8cfd-e0bf-4ae6-8a95-e03599122538)


The following filters are available:
- Object Type
- Orbit Code
- Attributes

**Click on the Apply Filter button to see the changes**

### Searching
There is a search box at the top right corner of the screen

![image](https://github.com/user-attachments/assets/2f8d0743-73b4-4005-a131-d4dfac560f91)

You can search by `Name` or the `NORAD CAT ID` of the object. `Press ENTER` to trigger the search

### Sorting
Clicking on any of these columns will sort them:
- Name
- NORAD CAT ID
- Launch Date
- Country Code

### Selectable Rows
Clicking on the checkbox of each row, will select that particular object

![image](https://github.com/user-attachments/assets/bcc5ab22-9828-4f8f-8ba9-83fa5464a243)

Now a `Proceed to Selected Items` button will be visible beside the search bar, click on it to view the selected items on the next page.

![image](https://github.com/user-attachments/assets/6ca0468d-d286-49af-a544-2c788d968762)
