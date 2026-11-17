const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

const dataFile = path.join(__dirname, "notes.json");

// Create JSON storage if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
}

// Read notes
function getNotes() {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// Save notes
function saveNotes(notes) {
    fs.writeFileSync(dataFile, JSON.stringify(notes, null, 2));
}

// GET: Display all notes
app.get("/notes", (req, res) => {
    res.json(getNotes());
});

// POST: Create a new note
app.post("/notes", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const notes = getNotes();

    const newNote = {
        id: Date.now().toString(),
        title,
        content
    };

    notes.push(newNote);
    saveNotes(notes);

    res.status(201).json(newNote);
});

// DELETE: Delete a note by ID
app.delete("/notes/:id", (req, res) => {
    const notes = getNotes();
    const updatedNotes = notes.filter(
        note => note.id !== req.params.id
    );

    if (notes.length === updatedNotes.length) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    saveNotes(updatedNotes);

    res.json({ message: "Note deleted successfully" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
