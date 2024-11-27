[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Hs8FT2up)
# Assignment 3 (A3)

Now that we have our basic workout app working (A2) we are going to build out more features. Our starting point is your A2 code, so copy it into this repo (not the `.github` folder). ***The goal is to have a production ready workout app by the end of A3.*** Some of the features below are harder to implement than others. We recommend staring with the "Persisting state" and then doing the rest in any order.

## Project setup

**You may have noticed that the `src` directory is empty. This is because A3 will build on your code from A2. Before you begin, please copy ONLY the `src` folder from your A2 repo into this one and run `npm install` to get your dependencies installed.**

NOTE: If you installed any additional dependencies outside of the default set provided by us, then you will have to also install them here with.

## List of new features 

### Persisting state
Our workout app has a pretty big problem, when the user refreshes the page we lose all configuration. We want to solve this by persisting state, so that if the page is reloaded or closed accidentally, we can restore the user to the same state. We like to think of it as we have two separate chunks of state we want to store.

#### Timer Configuration
We can store this in the URL. This would allow a user to share the URL with a friend to share the workout with them. As the user changes the configuration, we want to update the url. We recommend that you only update the URL after a user "saves" a timer. That is, don't update URL every time they enter an input, but instead have some sort of save button that persists the state both to context and to the URL. 

#### Timer State
Once the user has configured the workout and started the workout, we want to store the running state in local storage. We don't want to be doing a million writes to local storage, so I recommend that you think about how we can accomplish this with fewer writes. It doesn't have to restore to the latest millisecond, but it should be somewhat close (1-2 seconds) to what the workout was at after a reload/refresh of the page.

### Edit a timer
After the workout has been configured and the user is on the main run workout screen, add functionality that allows the user to edit any of the timer configurations (remember to update URL).

### Change the order of a timer in configured workout
After the workout has been configured and the user is on the main run workout screen, the user can move any timer to a different position in the queue. This can be done a couple of ways. You are welcome to use a drag and drop third party package or come up with something on your own (remember to update URL). The user should also be able to remove a timer from the queue.

### Display total time 
After the workout has been configured and the user is on the main run workout screen, display the total workout time and count down from total time to zero (when workout is complete) once the workout has been started.

### Add description to each timer
Add a description field to each time that the user can add when creating the timer and when editing the timer. It should be displayed while the timer is running. This allows the users to describe what needs to be done in that "block" (i.e. 50 push ups).

### Wrap app using react-error-boundary
If for any reason your workout app errors out, then you should handle this and present the user with an error message. `react-error-boundary` package has a nice implementation of react "error boundaries" that you can use to handle this scenario.

### Workout history (Only Graduate)
We want to create a new screen that displays a list of previous workouts (create a new route and link to the history page in the navbar). ***Once a workout has been completed, add this workout to the history and save it to local storage***. On the new history screen display all workouts completed and for each workout you should display some summary of all timers run and what the durations/rounds for each timer was.

## Deliverables
- Complete all features listed above
- As always deploy your app 

## Grading Rubric
We will be grading based on the features listed above and overall code quality
- Persisting state (20pt)
- Edit a timer (10pt)
- Change the order of a timer in configured workout (10pt)
- Display total time (10pt)
- Add description to each timer (5pt)
- Wrap app using react-error-boundary (5pt)
- Workout history (20pt) (Only Graduate)
- DRY and overall code quality (20pt)

## Dev Setup

**Prerequisite: you have `node` installed on the command line and can run `node --version`**

1. Open a terminal and navigate to the root of this repository
2. Run: `npm install`
3. Install [VSCode](https://code.visualstudio.com/?wt.mc_id=vscom_downloads)
4. Open VSCode. Install the recommended extensions that pop up in the bottom right. If you don't see this, then you can manually install the following two extensions: [BiomeJS](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) and [TailwindCSS](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).
5. You might need to restart VSCode in order for extensions to take in effect. Restart by running `CMD+Shift+P` and search for "Reload Window", hit `Enter`.
6. Verify that BiomeJS is working by adding some extra indents/spaces in `src/main.tsx`. It should format the file on save.
7. Start the dev server with `npm run dev` and navigate to http://localhost:5173/

## Deploy to GH-Pages

**It is important that you follow these steps in the correct order:**

1. Open `package.json` and update the `"homepage"` key with your repo information. It should change from:

`"homepage": "https://hes-e39.github.io/react-ts-template/"`

to

`"homepage": "https://hes-e39.github.io/<your repo>/"`

If you created this repo in github classrooms, the repo name should have your username at the end of it. Make sure to copy the whole thing. Also make sure the trailing `/` follows after your repo name.

2. Push changes to GH
3. Wait until actions finish, this will create a new branch `gh-pages` and run the deployment
4. In your GH repo: Settings -> Pages -> Build and deployment -> Branch -> gh-pages
