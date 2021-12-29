const express = require('express');
const Job = require('../models/Job');
// const User = require('../models/User');

const StatusCodes = require('http-status-codes')
const router = express.Router();
const mongoose = require('mongoose')
const moment = require('moment')
const {BadRequestError, NotFoundError } = require('../errors/index.js')
var fetchuser = require('../middleware/authentication')



// get all jobs
router.post('/getAllJobs',fetchuser, async (req, res) => {
// router.post('/getAllJobs', async (req, res) => {

    const { search, status, jobType, sort } = req.query
    req.body.createdBy = req.user.id;
    const queryObject = {
        createdBy: req.user.id,
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' }
    }
    if (status !== 'all') {
        queryObject.status = status
    }
    if (jobType !== 'all') {
        queryObject.jobType = jobType
    }
    console.log(queryObject)

    let result = await Job.find(queryObject)
    // console.log(result)

    if (sort === 'latest') {
        result = result.sort(function(a,b){return b.createdAt - a.createdAt})
    }
    if (sort === 'oldest') {
        // result = result.sort('createdAt')
        result = result.sort(function(a,b){return a.createdAt - b.createdAt})
    }
    if (sort === 'a-z') {
        // result = result.sort('position')
        result = result.sort((a,b)=>{
          let fa = a.position.toLowerCase();
          let fb = b.position.toLowerCase();
          if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
        })

    }
    if (sort === 'z-a') {
        // result = result.sort('-position')
        result = result.sort((a,b)=>{
          let fa = a.position.toLowerCase();
          let fb = b.position.toLowerCase();
          if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
        return 0;
        })

    }

    const totalJobs = result

    // setup pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    // const skip = (page - 1) * limit
    const numOfPages = Math.ceil(totalJobs.length / limit)
    console.log(result)
    // result = result.skip(skip).limit(limit)
    // result = result

    // 23
    // 4 7 7 7 2
    const jobs =  result
    res
        .status(StatusCodes.OK)
        .json({ jobs, totalJobs: totalJobs.length, numOfPages })
}
)

router.post('/createJob',fetchuser, async (req, res) => {
// router.post('/createJob', async (req, res) => {


    const { position, company, jobType } = req.body

    if (!position || !company ||!jobType) {
        throw new BadRequestError('Please Provide All Values')
    }
    createdBy = req.user.id

    const job = new Job({
      position, company,jobType, createdBy
    })
    const savedjob = await job.save();
        res.json(savedjob)


    // const newjob = await Job.create(req.body)
    // res.json({job});
    // res.status(StatusCodes.CREATED).json({ newjob })

})


router.patch('/updateJob/:id',fetchuser, async (req, res) => {
// router.patch('/updateJob/:id', async (req, res) => {

    const {
        body,
        user: { userId },
        params: { id: jobId },
      } = req
      const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        body,
        { new: true, runValidators: true }
      )
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).json({ job })

})


router.delete('/deleteJob/:id',fetchuser, async (req, res) => {
// router.delete('/deleteJob/:id', async (req, res) => {
    
    const {
        // user: { id },
        params: { id: jobId },
      } = req
    
      const job = await Job.findByIdAndRemove({
        _id: jobId,
        // createdBy: id,
      })
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).send()
})

router.get('/stats',fetchuser, async (req, res) => {
// router.get('/stats', async (req, res) => {

  
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ])
      stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
      }, {})
    
      const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
      }
    
      // setup default
    
      let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
        {
          $group: {
            _id: {
              year: {
                $year: '$createdAt',
              },
              month: {
                $month: '$createdAt',
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
      ])
    
      monthlyApplications = monthlyApplications
        .map((item) => {
          const {
            _id: { year, month },
            count,
          } = item
          // accepts 0-11
          const date = moment()
            .month(month - 1)
            .year(year)
            .format('MMM Y')
          return { date, count }
        })
        .reverse()
    
      res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
    
})


module.exports=router;
