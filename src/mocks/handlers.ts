import { rest } from 'msw';
import { db } from '../services/database';
import { Job, Candidate, Assessment, AssessmentResponse } from '../types';

const simulateLatency = (min: number = 200, max: number = 1200) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const simulateError = (errorRate: number = 0.1) => Math.random() < errorRate;

export const handlers = [
  // Jobs endpoints
  rest.get('/api/jobs', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.05)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to fetch jobs' })
        );
      }

      const search = req.url.searchParams.get('search') || '';
      const status = req.url.searchParams.get('status') || '';
      const page = parseInt(req.url.searchParams.get('page') || '1');
      const pageSize = parseInt(req.url.searchParams.get('pageSize') || '10');
      
      let jobs = await db.jobs.toArray();
      
      // Filtering
      if (search) {
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company?.toLowerCase().includes(search.toLowerCase()) ||
          job.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      if (status) {
        jobs = jobs.filter(job => job.status === status);
      }
      
      // Sort by order
      jobs.sort((a, b) => a.order - b.order);
      
      // Pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedJobs = jobs.slice(start, end);
      
      return res(
        ctx.json({
          data: paginatedJobs,
          total: jobs.length,
          page,
          pageSize,
          totalPages: Math.ceil(jobs.length / pageSize)
        })
      );
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to fetch jobs' })
      );
    }
  }),

  rest.post('/api/jobs', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to create job' })
        );
      }

      const jobData = await req.json();
      const jobs = await db.jobs.toArray();
      const maxOrder = Math.max(...jobs.map(j => j.order), 0);
      
      // Check if slug already exists
      const existingJob = jobs.find(job => job.slug === jobData.slug);
      if (existingJob) {
        return res(
          ctx.status(400),
          ctx.json({ error: 'Job with this slug already exists' })
        );
      }
      
      const newJob: Job = {
        ...jobData,
        id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: maxOrder + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.jobs.add(newJob);
      return res(ctx.json(newJob));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to create job' })
      );
    }
  }),

  rest.patch('/api/jobs/:id', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to update job' })
        );
      }

      const { id } = req.params;
      const updates = await req.json();
      
      const existingJob = await db.jobs.get(id as string);
      if (!existingJob) {
        return res(
          ctx.status(404),
          ctx.json({ error: 'Job not found' })
        );
      }
      
      // Check if slug already exists (excluding current job)
      if (updates.slug && updates.slug !== existingJob.slug) {
        const jobs = await db.jobs.toArray();
        const slugExists = jobs.some(job => job.slug === updates.slug && job.id !== id);
        if (slugExists) {
          return res(
            ctx.status(400),
            ctx.json({ error: 'Job with this slug already exists' })
          );
        }
      }
      
      await db.jobs.update(id as string, {
        ...updates,
        updatedAt: new Date()
      });
      
      const updatedJob = await db.jobs.get(id as string);
      return res(ctx.json(updatedJob));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to update job' })
      );
    }
  }),

  rest.patch('/api/jobs/reorder', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to reorder jobs' })
        );
      }

      const { fromOrder, toOrder } = await req.json();
      const jobs = await db.jobs.toArray();
      
      // Find the job being moved
      const jobToMove = jobs.find(job => job.order === fromOrder);
      if (!jobToMove) {
        return res(ctx.status(404));
      }
      
      // Update orders
      if (fromOrder < toOrder) {
        // Moving down
        for (const job of jobs) {
          if (job.order > fromOrder && job.order <= toOrder) {
            await db.jobs.update(job.id, { order: job.order - 1 });
          }
        }
      } else {
        // Moving up
        for (const job of jobs) {
          if (job.order >= toOrder && job.order < fromOrder) {
            await db.jobs.update(job.id, { order: job.order + 1 });
          }
        }
      }
      
      // Update the moved job
      await db.jobs.update(jobToMove.id, { order: toOrder });
      
      return res(ctx.json({ success: true }));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to reorder jobs' })
      );
    }
  }),

  // Candidates endpoints
  rest.get('/api/candidates', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.05)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to fetch candidates' })
        );
      }

      const search = req.url.searchParams.get('search') || '';
      const stage = req.url.searchParams.get('stage') || '';
      const page = parseInt(req.url.searchParams.get('page') || '1');
      const pageSize = parseInt(req.url.searchParams.get('pageSize') || '50');
      
      let candidates = await db.candidates.toArray();
      
      // Filtering
      if (search) {
        candidates = candidates.filter(candidate =>
          candidate.name.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (stage) {
        candidates = candidates.filter(candidate => candidate.stage === stage);
      }
      
      // Pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedCandidates = candidates.slice(start, end);
      
      return res(
        ctx.json({
          data: paginatedCandidates,
          total: candidates.length,
          page,
          pageSize
        })
      );
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to fetch candidates' })
      );
    }
  }),

  rest.post('/api/candidates', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to create candidate' })
        );
      }

      const candidateData = await req.json();
      
      const newCandidate: Candidate = {
        ...candidateData,
        id: `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appliedDate: new Date(),
        notes: []
      };
      
      await db.candidates.add(newCandidate);
      return res(ctx.json(newCandidate));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to create candidate' })
      );
    }
  }),

  rest.patch('/api/candidates/:id', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to update candidate' })
        );
      }

      const { id } = req.params;
      const updates = await req.json();
      
      await db.candidates.update(id as string, updates);
      const updatedCandidate = await db.candidates.get(id as string);
      return res(ctx.json(updatedCandidate));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to update candidate' })
      );
    }
  }),

  rest.get('/api/candidates/:id/timeline', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.05)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to fetch timeline' })
        );
      }

      const { id } = req.params;
      const candidate = await db.candidates.get(id as string);
      
      if (!candidate) {
        return res(
          ctx.status(404),
          ctx.json({ error: 'Candidate not found' })
        );
      }
      
      // Generate mock timeline based on candidate data
      const timeline = [
        {
          id: '1',
          type: 'stage_change',
          stage: candidate.stage,
          date: candidate.appliedDate,
          description: `Applied for position`
        }
      ];
      
      return res(ctx.json(timeline));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to fetch timeline' })
      );
    }
  }),

  // Assessment endpoints
  rest.get('/api/assessments/:jobId', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.05)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to fetch assessment' })
        );
      }

      const { jobId } = req.params;
      const assessment = await db.assessments.get(jobId as string);
      
      if (!assessment) {
        return res(
          ctx.status(404),
          ctx.json({ error: 'Assessment not found' })
        );
      }
      
      return res(ctx.json(assessment));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to fetch assessment' })
      );
    }
  }),

  rest.put('/api/assessments/:jobId', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to save assessment' })
        );
      }

      const { jobId } = req.params;
      const assessment = await req.json();
      
      await db.assessments.put(assessment);
      return res(ctx.json(assessment));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to save assessment' })
      );
    }
  }),

  rest.post('/api/assessments/:jobId/submit', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to submit assessment' })
        );
      }

      const response = await req.json();
      const id = `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newResponse: AssessmentResponse = {
        ...response,
        id,
        submittedAt: new Date()
      };
      
      await db.responses.add(newResponse);
      return res(ctx.json(newResponse));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Failed to submit assessment' })
      );
    }
  }),

  rest.post('/api/candidates', async (req, res, ctx) => {
    try {
      await simulateLatency();
      if (simulateError(0.1)) {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to create candidate' })
        );
      }

      const candidateData = await req.json();
    
      const newCandidate: Candidate = {
        ...candidateData,
        id: `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appliedDate: new Date(),
        notes: []
      };
    
      await db.candidates.add(newCandidate);
      return res(ctx.json(newCandidate));
    } catch (error) {
      return res(
      ctx.status(500),
      ctx.json({ error: 'Failed to create candidate' })
    );
  }
}),


];