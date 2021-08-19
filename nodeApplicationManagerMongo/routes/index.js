const express = require('express');
const router = express.Router();

// import the module that interacts with the database
const myDb = require("../db/myMongoDB.js");

/* GET home page. */
router.get('/', async function(req, res) {
  res.redirect("/postings");
});


router.get("/postings", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getPostingsCount(query);
    let postings = await myDb.getPostings(query, page, pageSize);
    res.render("./pages/index", {
      postings,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});


// to implement authors page
router.get("/applications", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getApplicationsCount(query);
    let applications = await myDb.getApplications(query, page, pageSize);
    res.render("./pages/applications", {
      applications,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});


router.get("/references/:reference_id/edit", async (req, res, next) => {
  const reference_id = req.params.reference_id;

  const msg = req.query.msg || null;
  try {

    let ref = await myDb.getReferenceByID(reference_id);
    // let authors = await myDb.getAuthorsByReferenceID(reference_id);

    console.log("edit reference", {
      ref,
      // authors,
      msg,
    });


    res.render("./pages/editReference", {
      ref,
      // authors,
      msg,
    });
  } catch (err) {
    next(err);
  }
});


router.post("/references/:reference_id/edit", async (req, res, next) => {
  const reference_id = req.params.reference_id;
  const ref = req.body;

  try {

    let updateResult = await myDb.updateReferenceByID(reference_id, ref);
    console.log("update", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect("/references/?msg=Updated");
    } else {
      res.redirect("/references/?msg=Error Updating");
    }

  } catch (err) {
    next(err);
  }
});


router.post("/references/:reference_id/addVenue", async (req, res, next) => {
  console.log("Add Venue", req.body);
  const reference_id = req.params.reference_id;
  const venue = {
    name: req.body.name,
    type: req.body.type
  };

  try {

    let updateResult = await myDb.addVenueToReferenceID(reference_id, venue);
    console.log("addVenueToReferenceID", updateResult);

    if (updateResult && updateResult.modifiedCount === 1) {
      res.redirect(`/references/${reference_id}/edit?msg=Venue added`);
    } else {
      res.redirect(`/references/${reference_id}/edit?msg=Error adding venue`);
    }

  } catch (err) {
    next(err);
  }
});


router.get("/references/:reference_id/delete", async (req, res, next) => {
  const reference_id = req.params.reference_id;

  try {

    let deleteResult = await myDb.deleteReferenceByID(reference_id);
    console.log("delete", deleteResult);

    if (deleteResult && deleteResult.changes === 1) {
      res.redirect("/references/?msg=Deleted");
    } else {
      res.redirect("/references/?msg=Error Deleting");
    }

  } catch (err) {
    next(err);
  }
});


router.post("/createPosting", async (req, res, next) => {
  const ref = req.body;

  try {
    const insertRes = await myDb.insertReference(ref);

    console.log("Inserted", insertRes);
    res.redirect("/references/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;
