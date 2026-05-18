import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Lead from './leaddb';

export const createLead = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, status, source } = req.body;
    const newLead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user?.id
    });
    return res.status(201).json({ success: true, message: "Lead created successfully", data: newLead });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    
    if (req.user?.role === 'sales' && lead.createdBy?._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to view this lead" });
    }

    return res.status(200).json({ success: true, message: "Lead fetched successfully", data: lead });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (req.user?.role === 'sales' && lead.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this lead" });
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json({ success: true, message: "Lead updated successfully", data: updatedLead });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<any> => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    const { id } = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({ success: true, message: "Lead deleted successfully", data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const allLeads = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status, source, search, sort, page = 1, limit = 10 } = req.query;
    let query: any = {};

    console.log("Logged in user context on request:", req.user);
    if (req.user?.role === 'sales') {
      query.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    if (status && status !== 'All') query.status = status;
    if (source && source !== 'All') query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sortObj: any = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    console.log("Final query being executed:", query);
    const leads = await Lead.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email');

    const total = await Lead.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: leads,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const exportCSV = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status, source, search } = req.query;
    let query: any = {};

    if (req.user?.role === 'sales') {
      query.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    if (status && status !== 'All') query.status = status;
    if (source && source !== 'All') query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name email');

    let csvString = "Name,Email,Status,Source,Created At,Created By\n";
    leads.forEach((lead: any) => {
      csvString += `${lead.name},${lead.email},${lead.status},${lead.source},${lead.createdAt},${lead.createdBy ? lead.createdBy.name : 'N/A'}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    return res.status(200).send(csvString);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
