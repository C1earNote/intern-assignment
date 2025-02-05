# Challenge Completed
### What I did
- A dropdown where the user can select a stock
- A way to switch between durations for the selected stock
- A graph for the selected stock and duration (remember the second API returns data over time - this graph should be updated dynamically)
- Make it responsive and look good!

### Tech constraints followed
- Used Redux Toolkit for managing global state, thunk for API calls
- Didn't drill props beyond level 2
- Used pre-built components and libraries (we use MUI and react-chartjs, but you are free to use any lib of your choice)

### Brownie points
- if you can show multiple graphs at the same time(**Half done**, there's some issue)
- if you can add login with a basic 2FA implementation (**Half done**)
_That makes one whole point right? ;)_


## Running services
### Instructions to run the UI
```bash
cd frontend
yarn start
```
- Put anything in the Login page (Because the service is not live so, email cannot be sent).
- Put anything in the 2FA page (Reason same as 1st point).
- Select the Conpany.
- Select the duration.
- Have fun looking at a fully functional dynamic stock chart.

### A demonstration video 📹
https://youtu.be/4J_B9iab9U4

### Instructions to run the backend API
Install the required libraries and then:
```bash
cd backend
yarn dev
```
or
```bash
cd backend 
yarn start
```
