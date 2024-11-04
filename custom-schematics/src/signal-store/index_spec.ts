import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

describe('signal-store', () => {
  it('contains a SignalStore', async () => {
    const collectionPath = path.join(__dirname, '../collection.json');

    const workspaceOptions = {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '18.0.0',
    };

    const runner = new SchematicTestRunner('schematics', collectionPath);
    const workspaceTree = await runner.runExternalSchematic(
      '@schematics/angular',
      'workspace',
      workspaceOptions,
    );

    const appTree = await runner.runExternalSchematic(
      '@schematics/angular',
      'application',
      { name: 'eternal' },
      workspaceTree,
    );
    const finalTree = await runner.runSchematic(
      'signal-store',
      { name: 'booking' },
      appTree,
    );

    expect(
      finalTree.readText('/projects/eternal/src/app/booking-store.ts'),
    ).toContain('export const BookingStore = signalStore');
  });
});
