import { Response } from 'express';
import { Lead } from '../models/lead.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { generateCsv } from '../utils/csvExport';

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = req.query.sort === 'oldest' ? 1 : -1;
  const { status, source, search } = req.query;

  const query: any = {};
  
  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    query.$or = [
      { name: { $regex: search as string, $options: 'i' } },
      { email: { $regex: search as string, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const leads = await Lead.find(query)
    .sort({ createdAt: sort })
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email');

  const total = await Lead.countDocuments(query);

  res.json({
    success: true,
    data: leads,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, status, source } = req.body;

  const lead = await Lead.create({
    name,
    email,
    status,
    source,
    createdBy: req.user?.userId as any,
  });

  const populatedLead = await lead.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    data: populatedLead,
  });
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  res.json({
    success: true,
    data: lead,
  });
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  res.json({
    success: true,
    data: {},
  });
});

export const exportLeadsCsv = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, source, search } = req.query;
  const query: any = {};
  
  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    query.$or = [
      { name: { $regex: search as string, $options: 'i' } },
      { email: { $regex: search as string, $options: 'i' } },
    ];
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 });
  
  const csvData = generateCsv(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.send(csvData);
});
