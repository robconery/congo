Congo, a Backbone MongoDB Explorer from Tekpub
=====

A MongoDB Explorer written in Backbone using Twitter Bootstrap. Part of [Tekpub's Backbone.series](http://tekpub.com/productions/backbone)

Congo is a bit of work-in-progress. We need this tool at Tekpub and in course of creating it, decided to record our work and present it to you, along with the project.

There are a number of things that we'd like to add, but right now Congo will:

 - Browse local MongoDB databases, collections, and documents
 - Allow you to edit each document using the excellent Ace Text Editor

The next work item is building in a query tool, and also some ad-hoc Map Reduce. 

### Requirements
Congo is written in Backbone and, of course, requires MongoDB. The project itself was created in WebMatrix so if you're a Microsoft developer you'll be able to download this directly and open it in WebMatrix 2.

The web server is NodeJS, [so you'll want to have Node installed as well](http://nodejs.org). If you receive errors on first start, run `npm install` in the root of the site (from the command line) to install any modules that don't get loaded from the repo.

### Installation
Clone this repo: `got clone https://github.com/tekpub/congo.git` into any directory and make sure that MongoDB and Node are installed on your machine. If you're using WebMatrix you can hit "Run" and up it will go.

On Mac/Linux, change directories into Congo and "npm start" to start up the web server. If you receive any errors on start, be sure to make sure that all modules are installed using `npm install -d`

**A note on builds**: Normally there would be some kind of build process which would concat/minify the JS files but we don't find much of a need for that here. Ideally this application won't be served for public consumption and is for admin needs only.

If you do need to build/minify - we suggest using CodeKit, LiveReload, Cassette, or whatever tool you normall use - and make it part of your development process.

