# onboarding-ui

#### How to Run

##### Running with Gulp
You will need npm. You can get it at [npmjs.com](https://www.npmjs.com/).

Once you have it, run `npm install` to install the dependencies this project relies on.

If you are running the app for the first time, run `gulp dev` to generate the runtime sources. This task will also start a server with live-reload.

Henceforth, you can run `gulp` to start the server without unnecessarily regenerating the runtime files. This server will also have live-reload.

You will see the app being served at [localhost:9000](http://localhost:9000/).

##### Running With Node
Clone this repository in the directory of your choosing.

Ensure you have node installed on your machine. You can verify this by running `node -v`.

Once you are confident node is installed, `cd` into the repo and run this command:

`node app/main.js`

The difference from the above is the files are being served via the logic inside of `main.js`.

#### Node Version
I am running node version `v8.9.4`.
