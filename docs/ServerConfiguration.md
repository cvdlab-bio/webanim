Multimedia module configuration guide
=====================================
This is an help guide to set up the environment and use the multimedia module of webanim project.
This module is developed on the `feature/multimedia` branch, and the guide refers to its configuration.
It will be updated when merging the branch to the `develop` or `master` branch

Base Requirements
-----------------
To make this module work you have to install the latest version of <a href="http://nodejs.org/#download">`node.js`</a> on your machine .

Installation
------------
Once an istance of node.js, you can clone the project running the command

	$ git clone git://github.com/cvdlab-bio/webanim.git
	$ git checkout feature/multimedia
	$ cd multimedia

Now, to make things go fine, you have to install the `video` module of `node.js` but it requires some work to do before it can be installed.
First of all you must download, compile and install the <a href="http://theora.org/downloads/">following libraries</a>:

* libogg
* libvorbis 
* libtheora

On Mac OS X unzip all the files, and for each of them run the following instruction:
	
	$ cd libXXX
	$ ./configure
	$ make
	$ sudo make install
	$ cd ..

On Linux you can use your package manager (apt, yum, pacman, ...) to download and install the latest version of theora/ogg libraries, or just follow the same procedure of Mac OS X.

If everything went fine, the `video` module can be installed running:

	$ npm install video

Once you've done this a `node_modules` directory should be present in your project folder, if so run:
	
	$ cd node_modules/video/

and open the `package.json` file with your favourite text editor and replace the line

	"main":"video"

with

	"main": "./build/Release/video.node"

save and quit.

Ok, now you have to install `formidable` module of `node.js`:

	$ npm install formidable

Now everything should go work, and test it running:
	
	$ node index.js

`clucene` is required to indexing the recorded videos. This package requires the boost library and clucene libraries. To install these libraries follow ( **in this order!** ) the instruction in the following links:

* <a href="http://www.boost.org/users/download/">Boost</a>
* <a href="http://clucene.sourceforge.net/download.shtml">CLucene</a>

After you've installed these libraries you have to install che `clucene` module through the following command:

	$ npm install clucene
	
Now you have to open the `node_modules/clucene` folder and you've to modify the `clucene.js` replacing this row

	var clucene = require("./build/default/clucene");

with this row

	var clucene = require("./build/Release/clucene.node");

Starting the Server
-------------------
If you have successfully configured the server, you can start it with the following command:

	$ node index.js
	
**BEWARE**: some Linux distributions call the `node.js` executable `nodejs` instead of `node`, so if the last command is not recognized, you can try with this one:

	$ nodejs index.js
	
If everything went fine, you can read the message

>**Server has starter.**
