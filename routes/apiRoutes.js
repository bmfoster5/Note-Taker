const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

router.get('/notes', (req, res) => {
    // implement fs readFile
    fs.readFile('./db/db.json', (err, data) => {
        // Return all saved notes as JSON
        res.json(JSON.parse(data))
    })
});

router.post('/notes', (req, res) => {
    //create a note object
    console.log(req.body);
    const { title, text } = req.body;


    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };
        readAndAppend(newNote, './db/db.json');
    } else {
        res.error('Error in adding note')
    }
    res.sendFile(path.join(__dirname, '../public/notes.html'))
})
//implement fs readFile and writeFile then send file with path to the notes HTML file
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            fs.writeFile(file, JSON.stringify(parsedData), (err) => {
                if (err) throw err;
                console.log('Note added successfully!')
            });
        }
    })
};
//add delete route
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err
        const parsedData = JSON.parse(data);
        const newDb = parsedData.filter((item) => item.id !== noteId)
        fs.writeFile('./db/db.json', JSON.stringify(newDb), (err) => {
            if (err) throw err;
            console.log('Note deleted successfully!')
        });
    })
    res.sendFile(path.join(__dirname, '../public/notes.html'))
})

module.exports = router;