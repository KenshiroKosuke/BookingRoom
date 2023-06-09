import { Room } from "../models/Room.js";

export async function getRooms(req, res, next) {
    let query;
    //Copy req.query
    const reqQuery = {...req.query}
    //Fields to exclude
    const removeFields = ['select','sort']
    //Loop over removed fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    //Crete query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = Room.find(JSON.parse(queryStr));
    //Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields)
    }
    //Sort
    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query=query.sort(sortBy)
    } else {
        //default
        query=query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||5;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit
    try {
        const total = await Room.countDocuments();
        query = query.skip(startIndex).limit(limit);
        //Real exec
        const rooms = await query;
        //Pagination result
        const pagination = {}
        //Next page exists
        if (endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }
        //Prev page exists (because startIndex is 0 only for first page)
        if (startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, msg: err })
    }
}

export async function getRoom(req, res, next) {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            res.status(400).json({ success: false, msg: `Room id ${req.params.id} doesn't exist.` })
            return;
        }
        res.status(200).json({ success: true, data: room });
    } catch (err) {
        res.status(400).json({ success: false, msg: `Fail to retrieve data. Please make sure the id you've entered is valid.` })
    }
}

export async function createRoom(req, res, next) {
    console.log(req.body)
    try {
        const room = await Room.create(req.body);
        res.status(201).json({ success: true, data: room })
    } catch (err) {
        res.status(400).json({ success: false, message: err })
    }
}
