## Node.js Basic

The folder contains codes along Node.js Crash Course by Traversy Media
https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=71s


### Set up
* npm install -g npm
* npm init -> package.json
* npm install `module_name` 
* npm install --save-dev `module_name` : __moduels for development__

    >> npm install -D 'nodemon' (also works)

** [NOTE] **
`node_modules` folder is created after installing modules, and is huge. When deploying it is suggested not to upload this. (DELETE IT!)

>> `npm install` command will help create node_modules for other users.


### Deployment on Heroku

On command line,

* heroku --version : check if installed, or install `heroku cli`
    - we push heroku app to git (for example)
    - on heroku web, instruction can be found on `Deploy` tab

* `heroku login`
* make sure you do NOT push node_modules (or others)-> .git ignore
* git init 
* git add *
* git commit -m "Initial commit" 
* `heroku create` -> will give a domain name
* (example) paste this on terminal -> `heroku git:remote -a limitless-journey-xxxxx` 
* `git push heroku master`
* `heroku open`
