const fs = require('fs');
const os = require('os');
const cl = require('current-line');
const { exit } = require('process');
const yargs = require('yargs')
const argv = yargs
    .command("create", "node index.js create --title=\"file_name\"", {
        title: {
            describe: "Name of the file",
            demandOption: true
        }
    })
    .strictCommands()
    .strictOptions()
    .argv;

if (argv._.length == 0) {
    console.log("Execute node index.js --help for usage.", cl.get().line);
    exit(1);
}

if (argv.title == true) {
    console.log("Please provide the title of the file.", cl.get().line);
    exit(1);
}

const listoffiles = __dirname + "/files/file.lst";
var filelist = [];
var dirtowrite = __dirname + "/files"

var errWritingFile = (filename, err) => {
    console.log("Writing content to file ", filename, " failed: ", err, cl.get().line);
    exit(2);
}

var writeContentToFile = (filename, data) => {
    fs.writeFile(filename, data, (err) => {
        if (err) {
            errWritingFile(filename, err);
        } else {
            console.log("Writing content to file", filename, "successfull !!", cl.get().line);
        }
    });
}

var appendContentToFile = (filename, data) => {
    fs.appendFile(filename, data, (err) => {
        if (err) {
            errWritingFile(filename, err);
        } else {
            console.log("Writing content to file", filename, "successfull !!", cl.get().line);
        }
    });
}
fs.stat(listoffiles, (err, stats) => {
    if (err) {
        writeContentToFile(listoffiles, argv.title);
        writeContentToFile(dirtowrite + "/" + argv.title, "You are awesome");
    } else {
        fs.readFile(listoffiles, (err, data) => {
            if (err) {
                console.log("Reading content from file ", listoffiles, " failed: ", err, cl.get().line);
                exit(3);
            } else {
                filelist = data.toString().split(os.EOL);
                console.log("Content read from file ", listoffiles, ": ", filelist, cl.get().line);
                if (filelist.length == 0) {
                    filelist.push(argv.title);
                    writeContentToFile(listoffiles, argv.title);
                    writeContentToFile(dirtowrite + "/" + argv.title, "You arse awesome");
                } else {
                    if (filelist.includes(argv.title)) {
                        console.log("File: ", argv.title, " already exists. Please provide different file name.", cl.get().line)
                    } else {
                        filelist.push(argv.title);
                        appendContentToFile(listoffiles, os.EOL + argv.title);
                        writeContentToFile(dirtowrite + "/" + argv.title, "You are awesome");
                    }
                }
            }
        });
    }
});
