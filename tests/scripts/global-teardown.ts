import Nyc from 'nyc';
import * as path from 'path';

export default async function createCoverageReport() {
  const coverageDir = path.join(process.cwd(), 'nyc');
  const nyc = new Nyc({
    tempDirectory: coverageDir,
    reporter: ['html'],
  });
  await nyc.report();
}
