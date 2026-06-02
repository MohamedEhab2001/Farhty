import { Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { Instance } from '../models/Instance';
import mongoose from 'mongoose';

// ─── Background deploy (no SSE) — used by EasyKash webhook ───────────────────
export async function deployInstanceBackground(
  templateSlug: string,
  instanceSlug: string,
  templateId: string,
  hashedPassword: string,
  isPreview = false
): Promise<{ instanceId: mongoose.Types.ObjectId | null; ok: boolean }> {
  const scriptPath = path.resolve(__dirname, '../../../../deploy-instance.sh');

  const exitCode = await new Promise<number>((resolve) => {
    const child = spawn('bash', [scriptPath, templateSlug, instanceSlug], {
      env: { ...process.env },
      shell: false,
    });
    child.stdout.on('data', (c: Buffer) => console.log('[bg-deploy]', c.toString().trimEnd()));
    child.stderr.on('data', (c: Buffer) => console.warn('[bg-deploy]', c.toString().trimEnd()));
    child.on('error', (e) => { console.error('[bg-deploy] script error:', e); resolve(1); });
    child.on('close', (code) => resolve(code ?? 1));
  });

  if (exitCode !== 0) {
    console.error(`[bg-deploy] Script exited with code ${exitCode} for ${instanceSlug}`);
    return { instanceId: null, ok: false };
  }

  try {
    const existing = await Instance.findOne({ slug: instanceSlug });
    if (existing) {
      existing.deployedAt = new Date();
      existing.lastUpdatedAt = new Date();
      await existing.save();
      return { instanceId: existing._id as mongoose.Types.ObjectId, ok: true };
    }
    const inst = await Instance.create({
      templateId: new mongoose.Types.ObjectId(templateId),
      slug: instanceSlug,
      password: hashedPassword,
      isPreview,
      data: new Map(),
      deployedAt: new Date(),
      lastUpdatedAt: new Date(),
    });
    console.log(`[bg-deploy] Instance ${instanceSlug} saved to DB`);
    return { instanceId: inst._id as mongoose.Types.ObjectId, ok: true };
  } catch (err) {
    console.error('[bg-deploy] DB save failed:', err);
    return { instanceId: null, ok: false };
  }
}

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

export async function rebuildTemplateInstances(
  res: Response,
  templateId: string,
  templateSlug: string
): Promise<void> {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const instances = await Instance.find({ templateId });

  if (instances.length === 0) {
    sendEvent(res, `[${timestamp()}] ℹ️ No instances found for template "${templateSlug}"`);
    sendEvent(res, 'DONE');
    res.end();
    return;
  }

  sendEvent(res, `[${timestamp()}] Found ${instances.length} instance(s) — starting batch rebuild...`);

  const scriptPath = path.resolve(__dirname, '../../../../rebuild-instance.sh');
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i];
    sendEvent(res, `[${timestamp()}] ─── (${i + 1}/${instances.length}) Rebuilding ${instance.slug}...`);

    const ok = await new Promise<boolean>((resolve) => {
      const child = spawn('bash', [scriptPath, templateSlug, instance.slug], {
        env: { ...process.env },
        shell: false,
      });
      child.stdout.on('data', (chunk: Buffer) => {
        chunk.toString().split('\n').filter(Boolean).forEach(line => sendEvent(res, line));
      });
      child.stderr.on('data', (chunk: Buffer) => {
        chunk.toString().split('\n').filter(Boolean).forEach(line => sendEvent(res, `[${timestamp()}] ⚠️ ${line}`));
      });
      child.on('error', () => resolve(false));
      child.on('close', (code) => resolve(code === 0));
    });

    if (ok) {
      await Instance.findByIdAndUpdate(instance._id, { deployedAt: new Date() });
      sendEvent(res, `[${timestamp()}] ✓ ${instance.slug} rebuilt`);
      succeeded++;
    } else {
      sendEvent(res, `[${timestamp()}] ❌ ${instance.slug} failed — continuing...`);
      failed++;
    }
  }

  sendEvent(res, `[${timestamp()}] ─── Batch complete: ${succeeded} succeeded, ${failed} failed`);
  sendEvent(res, failed === 0 ? 'DONE' : 'FAILED');
  res.end();
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
