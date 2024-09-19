import Job from "../models/jobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from 'dayjs';


// GET ALL JOBS
export const getAllJobs = async(req,res)=>{
    
    // console.log(req.query)
    // console.log(req.user);

    // search functionality
    const {search, jobStatus, jobType,sort}=req.query;
    const queryObject={
      createdBy:req.user.userId
    }

    if(search){
      queryObject.$or=[
        {position:{$regex:search, $options:'i'}},
        {company:{$regex:search, $options:'i'}},
    
      ];
    }

    if(jobStatus && jobStatus !== 'all'){
        queryObject.jobStatus=jobStatus
    }
    if(jobType && jobType !== 'all'){
        queryObject.jobType=jobType
    }

    const sortOptions={
      newest:'-createdAt',
      oldest:'createdAt',
      'a-z':'position',
      'z-a':'-position',
      
    }

    const sortKey=sortOptions[sort] || sortOptions.newest;
    
    //==== setup pagination ===//
    const page = Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 10
    const skip = (page-1)*limit;


    const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);
    // show the jobs after sorting and searching
    const totalJobs=await Job.countDocuments(queryObject);

    const numOfPages = Math.ceil(totalJobs/limit);
    res.status(StatusCodes.OK).json({totalJobs,numOfPages,currentPage:page,jobs});
};


// CREATE A JOB
export const createJob = async (req, res) => {

    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });   
};


// GET A JOB
export const getJob= async(req, res) => {
    // console.log(req.params.id)
    const job=await Job.findById(req.params.id)
    // console.log(job);
    res.status(StatusCodes.OK).json({ job });
};


// UPDATE A JOB
export const updateJob = async(req,res)=>{

    const updatedJob = await Job.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(StatusCodes.OK).json({msg:'job modified', job:updateJob });
};


// DELETE A JOB
export const deleteJob = async(req,res)=>{

    const removedJob = await Job.findByIdAndDelete(req.params.id);
    console.log(removedJob);
    res.status(StatusCodes.OK).json({msg:'job deleted', job:removedJob});
};

// export const showStats = async (req, res) => {
//     const defaultStats = {
//       pending: 22,
//       interview: 11,
//       declined: 4,
//     };
  
//     let monthlyApplications = [
//       {
//         date: 'May 23',
//         count: 12,
//       },
//       {
//         date: 'Jun 23',
//         count: 9,
//       },
//       {
//         date: 'Jul 23',
//         count: 3,
//       },
//     ];
//     res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
//   };

export const showStats = async (req, res) => {
    
    // counting each type of jobStatus with id like -pending,interview,declined
    let stats = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
    ]);

    // console.log(stats)

    // counting only job status  
    stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});
    
    // console.log(stats);

    // setting default counting value of status
    const defaultStats = {
      pending: stats.pending || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
    };
  
    let monthlyApplications = await Job.aggregate([
      { 
        $match: { 
            createdBy: new mongoose.Types.ObjectId(req.user.userId) 
        } 
    },
      
    //   in mongoose we can extract date and month using below 
      { 
        $group: { 
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
        },
      },

    //   lets sort date and year of last 6 months, -1 shows we date will start from base value
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    // 
    monthlyApplications = monthlyApplications.map((item) => {
        const {_id: { year, month },count,} = item;

        // in dayjs months starts from 0 but in mongoDB it starts from 1 so we have to subtract -1 to get january or 0th month
        const date = day().month(month - 1).year(year).format('MMM YY');
        return { date, count };
      })
      .reverse();
  
    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  };