# Peaksjs Demo

## Introduction

This is a simple app which allows an user to upload a single .wav file, which gets converted into JSON and then rendered as a waveform.
The user can play and pause at any point of the waveform, zoom in or out of the waveform and jump into different timestamps.

### Development mode

In the development mode, we will have 2 servers running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

### Production mode

In the production mode, we will have only 1 server running. All the client side code will be bundled into static files using webpack and it will be served by the Node.js/Express application.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/crsandeep/simple-react-full-stack

# Go inside the directory
cd simple-react-full-stack

# Install dependencies
yarn (or npm install)

# Build for production
yarn build (or npm run build)

# Start production server
yarn start (or npm start)
```

## Thoughts during the process

1. Figuring out where to best store state in React. I read up some best practices online and it seems like everyone has an opinion. I tried to keep as much state in the parent component as possible,
and keep most components as functional components. Easier to keep track of the data flow and have a single source of truth. That said, I did keep the peaksjs state in the AudioChart component.
I wanted to only initialise the Peaksjs instance when the AudioChart component is mounted, and it felt more appropriate to keep all things peaksjs in that component.

2. Frontend validation. I did the frontend validation in the React Dropzone itself or using HTML5 form validation, rather than building custom frontend validation. It seemed both simpler and more fool-proof.
The Dropzone checks if the correct file format is being dragged in, and only allows for a single file upload. 
The timestamp has to be in seconds, so I've set input box has a type `number` and step `0.01` to check if users are keying in numbers, up to 2 decimal places.

3. Rendering waveforms of different sizes effectively in peaksjs. I noticed files which are very small would break Peaksjs as the default zoom level is larger than the entirety of the file. 
I've set different zoom levels to accommodate different file sizes, and the user can toggle between each of them.

## Improvements

1. Storing files in S3. The master branch stores both the wav and json files locally, which wouldn't scale well. The S3 branch is my work in progress on storing the files in a publicly accessible bucket. 
The files seem to be stored fine, but I'm still working out the bucket permissions and how to retrieve them in the frontend via the static url. Also need a try catch when uploading in case request fails.
This would be a pretty important priority, but it also seemed that this task was focusing more on the frontend, which was why I started on setting up s3 late.

2. More testing. Everything has been tested manually because setting up UI tests for file upload and waveform rendering seemed quite involved + low additional value over testing manually given how simple the feature is. 
The enzyme library looks decent? Or maybe I can just mock it.

3. Allowing the user to directly access waveform in the future. What if the user wants to access the same waveform, without needing to upload a file again? I would move the converted file name into the Location header
of the POST response, the frontend uses the URL to retrieve the waveform from S3. I'll probably need to give each file an UUID for all files to be uniquely named and retrievable.

4. Better setup for deployment into production. I started with a react-express boilerplate, and the proxy is set up mainly for local development. Will need to think of how to get this app on something like NGINX,
especially if we expect loads of traffic. Also the boilerplate came with two separate package.jsons for client and server dependencies, feels kinda odd but I rolled with it for this project. Might want to change in the future.

5. Error messages for users. If any requests fails, it currently sends back a 400 with whatever error that's been caught in a single try catch. I would break the try catches down further, send user-readable error messages and
 build a component that renders the error message.

## The Challenge

At Papercup, we are building a translation platform for video creators. We pay alot of attention to design and UX in order to make it easier for creators to translate their videos into the world's languages.

The user should to be able to view the audio data. Your task is to build an app to display the waveform of a given piece of audio.

The user needs to be able to do the following actions in the user interface:

1. Upload a piece of audio
2. Use Peak.JS to display the waveform of the audio, with functionalities such as play, pause and jump to different timestamps.

#### Useful notes and links

 - Can assume that all audio files will only be in wav formats, and therefore no need to worry about functions to convert from mp3 to wav, for example.
 - PeakJS may only take in links to audio files, and not blobs of files. It also requires audiowaveform to be installed through brew or apt-get. It's a bit peculiar to work with, so do let Jiameng know of any questions or problems that you have!

These links may be helpful:
- [Create React App](https://github.com/facebook/create-react-app)
- [Peaks.js](https://github.com/bbc/peaks.js)
- [AirBnB style guide](https://github.com/airbnb/javascript)

## Credits

This application is created from the [boilerplate](https://github.com/crsandeep/simple-react-full-stack) here.
