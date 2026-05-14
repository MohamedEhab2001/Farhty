import { Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { Instance } from '../models/Instance';
import mongoose from 'mongoose';

function timestamp(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

function sendEvent(res: Response, data: string): void {
  res.write(`data: ${data}\n\n`);
}

export async function deployInstance(
  res: Response,
  templateSlug: string,
  instanceSlug: string,
  templateId: string,
  password: string,
  isPreview: boolean
): Promise<void> {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sendEvent(res, `[${timestamp()}] 🚀 Starting deployment of ${instanceSlug}...`);

  // Script lives at monorepo root: /var/www/farhty/deploy-instance.sh
  // __dirname in compiled JS: /var/www/farhty/apps/api/dist/services/
  // → go up 4 levels to reach repo root
  const scriptPath = path.resolve(__dirname, '../../../../deploy-instance.sh');

  sendEvent(res, `[${timestamp()}] Building template ${templateSlug}...`);

  const child = spawn('bash', [scriptPath, templateSlug, instanceSlug], {
    env: { ...process.env },
    shell: false,
  });

  child.stdout.on('data', (chunk: Buffer) => {
    const lines = chunk.toString().split('\n').filter(Boolean);
    for (const line of lines) {
      sendEvent(res, line);
    }
  });

  child.stderr.on('data', (chunk: Buffer) => {
    const lines = chunk.toString().split('\n').filter(Boolean);
    for (const line of lines) {
      sendEvent(res, `[${timestamp()}] ⚠️ ${line}`);
    }
  });

  child.on('error', async (err) => {
    sendEvent(res, `[${timestamp()}] ❌ Script error: ${err.message}`);
    await saveInstance(res, templateId, instanceSlug, password, isPreview);
    sendEvent(res, 'FAILED');
    res.end();
  });

  child.on('close', async (code) => {
    if (code === 0) {
      sendEvent(res, `[${timestamp()}] ✓ Build complete`);
    } else {
      sendEvent(res, `[${timestamp()}] ⚠️ Script exited with code ${code} (may be OK in local dev)`);
    }

    await saveInstance(res, templateId, instanceSlug, password, isPreview);
    sendEvent(res, 'DONE');
    res.end();
  });
}

export async function rebuildInstance(
  res: Response,
  templateSlug: string,
  instanceSlug: string,
  instanceId: string
): Promise<void> {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sendEvent(res, `[${timestamp()}] 🔄 Rebuilding ${instanceSlug}...`);

  const scriptPath = path.resolve(__dirname, '../../../../rebuild-instance.sh');

  const child = spawn('bash', [scriptPath, templateSlug, instanceSlug], {
    env: { ...process.env },
    shell: false,
  });

  child.stdout.on('data', (chunk: Buffer) => {
    const lines = chunk.toString().split('\n').filter(Boolean);
    for (const line of lines) sendEvent(res, line);
  });

  child.stderr.on('data', (chunk: Buffer) => {
    const lines = chunk.toString().split('\n').filter(Boolean);
    for (const line of lines) sendEvent(res, `[${timestamp()}] ⚠️ ${line}`);
  });

  child.on('error', (err) => {
    sendEvent(res, `[${timestamp()}] ❌ Script error: ${err.message}`);
    sendEvent(res, 'FAILED');
    res.end();
  });

  child.on('close', async (code) => {
    if (code === 0) {
      try {
        await Instance.findByIdAndUpdate(instanceId, { deployedAt: new Date() });
        sendEvent(res, `[${timestamp()}] 📝 Instance timestamp updated`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        sendEvent(res, `[${timestamp()}] ⚠️ DB update skipped: ${msg}`);
      }
      sendEvent(res, `[${timestamp()}] ✓ Done → https://${instanceSlug}.farhty.online`);
      sendEvent(res, 'DONE');
    } else {
      sendEvent(res, `[${timestamp()}] ❌ Script exited with code ${code}`);
      sendEvent(res, 'FAILED');
    }
    res.end();
  });
}

async function saveInstance(
  res: Response,
  templateId: string,
  slug: string,
  password: string,
  isPreview: boolean
): Promise<void> {
  try {
    // Check if instance already exists (redeploy)
    const existing = await Instance.findOne({ slug });
    if (existing) {
      existing.deployedAt = new Date();
      existing.lastUpdatedAt = new Date();
      await existing.save();
      sendEvent(res, `[${timestamp()}] 📝 Instance record updated in MongoDB`);
    } else {
      await Instance.create({
        templateId: new mongoose.Types.ObjectId(templateId),
        slug,
        password,        // already hashed by route handler
        isPreview,
        data: new Map(),
        deployedAt: new Date(),
        lastUpdatedAt: new Date(),
      });
      sendEvent(res, `[${timestamp()}] 📝 Instance record saved to MongoDB`);
    }
    sendEvent(res, `[${timestamp()}] ✓ Deployed → ${slug}.farhty.online`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    sendEvent(res, `[${timestamp()}] ❌ MongoDB save failed: ${msg}`);
  }
}
