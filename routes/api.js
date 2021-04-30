const router = require("express").Router();
const transaction = require("../models/transaction");

const path = require("path");

router.post("/api/transaction", ({ body }, res ) => {
    transaction.create(body)
    .then(dbtransaction => {
        res.json(dbtransaction)

    })
    .catch(error => {
        res.status(404).json(error)
    })
})

router.post("/api/transaction/bulk", ({ body }, res ) => {
    transaction.insertMany(body)
    .then(dbtransaction => {
        res.json(dbtransaction)

    })
    .catch(error => {
        res.status(404).json(error)
    })
})

router.get("/api/transaction", (req, res) => {
    transaction.find({}).sort({ date: -1 })
    .then(dbtransaction => {
        res.json(dbtransaction)
    })
    .catch(error => {
        res.status(404).json(error)
    })
})

module.exports = router;