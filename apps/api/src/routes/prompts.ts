import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Prompt } from '../models/Prompt.js';

const router = Router();

const PLATFORM_COLORS: Record<string, string> = {
  ChatGPT: 'bg-green-100 text-green-800',
  Claude: 'bg-purple-100 text-purple-800',
  Copilot: 'bg-blue-100 text-blue-800',
  Gemini: 'bg-amber-100 text-amber-800',
  Midjourney: 'bg-pink-100 text-pink-800',
  Other: 'bg-slate-100 text-slate-800',
};

function formatVotes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

interface PromptDoc {
  _id: { toString(): string };
  title: string;
  platform: string;
  category: string;
  votes: number;
  description: string;
  promptText: string;
  exampleOutput?: string;
  author?: { name: string; avatar: string; role: string };
  createdAt: Date;
}

function toResponse(doc: PromptDoc) {
  const categorySlug = doc.category.toLowerCase().replace(/\s+/g, '-');
  const slugMap: Record<string, string> = {
    'creative-writing': 'writing',
    'data-analysis': 'data',
    coding: 'coding',
    productivity: 'productivity',
    other: 'other',
  };
  const slug = slugMap[categorySlug] ?? categorySlug;
  const platformColor = PLATFORM_COLORS[doc.platform] ?? PLATFORM_COLORS.Other;
  const createdAgo = getCreatedAgo(doc.createdAt);
  return {
    id: doc._id.toString(),
    title: doc.title,
    platform: doc.platform,
    category: doc.category,
    categorySlug: slug,
    votes: formatVotes(doc.votes),
    votesCount: doc.votes,
    description: doc.description,
    promptText: doc.promptText,
    output: doc.exampleOutput ?? '',
    platformColor,
    author: doc.author ?? { name: 'Anonymous', avatar: '', role: 'Member' },
    createdAt: doc.createdAt,
    createdAgo,
  };
}

function getCreatedAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}

// GET /api/prompts - list with category, sort, page, limit, q (search)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, sort = 'newest', page = '1', limit = '10', q } = req.query;
    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (category && String(category).trim()) {
      const slug = String(category).toLowerCase();
      const categoryMap: Record<string, string> = {
        writing: 'Creative Writing',
        coding: 'Coding',
        data: 'Data Analysis',
        productivity: 'Productivity',
        other: 'Other',
      };
      filter.category = categoryMap[slug] ?? String(category);
    }
    if (q && String(q).trim()) {
      const search = String(q).trim();
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { promptText: new RegExp(search, 'i') },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'top' || sort === 'toprated') sortOption = { votes: -1, createdAt: -1 };
    else if (sort === 'trending') sortOption = { votes: -1, createdAt: -1 };

    const [items, total] = await Promise.all([
      Prompt.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Prompt.countDocuments(filter),
    ]);

    const prompts = items.map((doc: PromptDoc) => toResponse(doc));
    res.json({ prompts, total, page: pageNum, limit: limitNum });
  } catch (err) {
    console.error('GET /api/prompts error:', err);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// GET /api/prompts/favorites - return list of ids (client sends ids in query for batch)
router.get('/favorites', (_req: Request, res: Response) => {
  res.json({ ids: [] });
});

// GET /api/prompts/recent - return list of ids (client-side storage)
router.get('/recent', (_req: Request, res: Response) => {
  res.json({ ids: [] });
});

// GET /api/prompts/by-ids?ids=id1,id2 - batch fetch for favorites/recent
router.get('/by-ids', async (req: Request, res: Response) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam || typeof idsParam !== 'string') {
      return res.json({ prompts: [] });
    }
    const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return res.json({ prompts: [] });
    const validIds = ids.filter((id) => mongoose.isValidObjectId(id));
    const items = await Prompt.find({ _id: { $in: validIds } }).lean();
    const orderMap = new Map(validIds.map((id, i) => [id, i]));
    const sorted = [...items].sort((a, b) => {
      const aId = (a as PromptDoc)._id.toString();
      const bId = (b as PromptDoc)._id.toString();
      return (orderMap.get(aId) ?? 0) - (orderMap.get(bId) ?? 0);
    });
    res.json({ prompts: sorted.map((d) => toResponse(d as PromptDoc)) });
  } catch (err) {
    console.error('GET /api/prompts/by-ids error:', err);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// GET /api/prompts/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prompt = await Prompt.findById(id).lean();
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(toResponse(prompt as PromptDoc));
  } catch (err) {
    console.error('GET /api/prompts/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// POST /api/prompts
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, category, platform, description, promptText, exampleOutput } = req.body;
    if (!title || !category || !platform || !description || !promptText) {
      return res.status(400).json({ error: 'Missing required fields: title, category, platform, description, promptText' });
    }
    const doc = await Prompt.create({
      title: String(title).trim(),
      category: String(category).trim(),
      platform: String(platform).trim(),
      description: String(description).trim(),
      promptText: String(promptText).trim(),
      exampleOutput: exampleOutput != null ? String(exampleOutput).trim() : '',
      votes: 0,
      author: { name: 'Anonymous', avatar: '', role: 'Member' },
    });
    const response = toResponse(doc as unknown as PromptDoc);
    res.status(201).json(response);
  } catch (err) {
    console.error('POST /api/prompts error:', err);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// PATCH /api/prompts/:id/vote
router.patch('/:id/vote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { direction } = req.body;
    if (direction !== 'up' && direction !== 'down') {
      return res.status(400).json({ error: 'Invalid direction; use "up" or "down"' });
    }
    const delta = direction === 'up' ? 1 : -1;
    const prompt = await Prompt.findByIdAndUpdate(id, { $inc: { votes: delta } }, { new: true }).lean();
    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
    res.json(toResponse(prompt as PromptDoc));
  } catch (err) {
    console.error('PATCH /api/prompts/:id/vote error:', err);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

export default router;
