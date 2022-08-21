
const { validationResult } = require('express-validator');
let Word = require("../models/word.js").Word;
class WordController {

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: "wrong data in word creation" });
            }
            const { word, translate, topicID } = req.body
            const newWord = new Word({
                word,
                translate,
                topicID,
                learned: false
            });
            await newWord.save(function (err, word, affected) {
                if (err) {
                    return res.status(500).send("error word save");
                } else {
                    return res.status(200).send(`topic ${word} was created`);
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(500).send("some error");
        }
    };

    async read(req, res) {
        try {
            const id = req.query.id
            if (!id) {
                return res.status(404).send("error need id qerty param");
            }
            const words = await Word.find({ "topicID": id })
            const result = await words.map(item => ({
                word: item.word,
                translate: item.translate,
                id: item.id,
                learned: item.learned
            }))
            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send("some error");
        }
    }
    async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: "wrong data in word updating" });
            }
            const { translate, wordID, learned } = req.body
            const wordName = req.body.word
            let word
            try {
                word = await Word.findOne({ _id: wordID })
            }
            catch (error) {
                return res.status(400).send("word not found");
            }
            const newWord = {
                word: wordName,
                translate,
                topicID: word.topicID,
                learned
            };
            await Word.findOneAndUpdate({ _id: wordID }, newWord)
            return res.status(200).send(`word ${newWord.word} was updated`);
        } catch (error) {
            return res.status(500).send("some error in word update");
        }
    };
    async delete(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: "wrong data in word updating" });
            }
            const { wordsID } = req.body
            Word.deleteMany(
                {
                    _id: {
                        $in: wordsID
                    }
                },
                function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        return res.status(200).send(`wordsIDS ${wordsID} were deleted`);
                    }
                }
            );

        } catch (error) {
            return res.status(500).send("some error in word update");
        }
    };
}
module.exports = new WordController()