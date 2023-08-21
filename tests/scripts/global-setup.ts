import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsn from 'fs';

export default async function createCoverageReport() {
  const coverageDir = path.join(process.cwd(), 'nyc');
  if (fsn.existsSync(coverageDir)) {
    await fs.rm(coverageDir, { recursive: true });
  }
  await fs.mkdir(coverageDir);
}
