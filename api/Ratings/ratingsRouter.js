const authRequired = require('../middleware/authRequired');
const express = require('express');
const ratings = require('./ratingsModel');
const router = express.Router();

router.all('/', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

/******************************************************************************
 *                      GET ALL ratings by groomer id
 ******************************************************************************/
router.get('/', async (req, res) => {
  try {
      
    const { groom_id } = req.body;

    if (!req.body) {
        return res.status(400).json({ message: "Groomer ID required!" });
      }

    const data = await ratings.findRatingByUser(groom_id );

    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/******************************************************************************
 *                     GET total groomer rating vote count (not average)
 ******************************************************************************/
router.get('/count', async (req, res) => {
    try {  
      const { groom_id } = req.body;

      if (!req.body) {
          return res.status(400).json({ message: "Groomer ID required!" });
        }

      const data = await ratings.getRatingCount(groom_id);
  
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  /******************************************************************************
 *                     GET total groomer rating count (not average)
 ******************************************************************************/
router.get('/average', async (req, res) => {
    try {
        
      const { groom_id } = req.body;
  
      if (!req.body) {
          return res.status(400).json({ message: "Groomer ID required!" });
        }
  
      const data = await ratings.getRatingsAvg(groom_id);
  
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

/******************************************************************************
 *           POST/PUT a rating ( if rating relation exists, PUT is triggered) 
 ******************************************************************************/

router.post('/', async (req, res) => {
  try {
    const validNumz = [1,2,3,4,5]
    const { customer_id, groom_id, rate } = req.body;
    const newRating = { customer_id, groom_id, rate }
    const invalid = !customer_id || !groom_id || !rate
    if (invalid) {
        return res.status(404).json({ message: 'Missing required fields' });
    }
    if(!validNumz.includes(rate)){
        return res.status(400).json({ message: 'Rating must be int(1-5)!' });
    }
    const rated = await ratings.findRatingByUsers(customer_id, groom_id);

    if (rated.length) {
        await ratings.updateRating( customer_id, groom_id, rate )
        return res.status(200).json({message: 'Rating updated!'});
    }

    await ratings.addRating(newRating);

    res.status(200).json(newRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
