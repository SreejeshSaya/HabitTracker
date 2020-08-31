# HabitTracker Server

## Installation

Download only dependecies and not devDependencies (Although you can choose to install devDependencies locally by removing the --only flag)
```
npm install --only=dev
```

Now download the devDependency nodemon (if you dont have already)
```
sudo npm install -g nodemon
```

MongoDB Atlas credentials will have to be placed to the app's environment.

```
export HABIT_TRACKER_USERNAME =  <USERNAME>
export HABIT_TRACKER_PASSWORD =  <PASSWORD>
```

## Running
Make sure the client folder is also present alongside the server directory in the parent folder. (This is temporary)
```
npm start
```

Visit 
```
localhost:3000/login.html
```

