// THIS CODE WAS AUTOMATICALLY GENERATED
// DO NOT EDIT THIS CODE BY HAND
// RUN THE FOLLOWING COMMAND FROM THE WORKSPACE ROOT TO REGENERATE:
// npx nx generate-lib repo

import type { LibDefinition } from '../variable';

import { dom } from './dom';
import { dom_asynciterable } from './dom.asynciterable';
import { dom_iterable } from './dom.iterable';
import { es2023 } from './es2023';
import { scripthost } from './scripthost';
import { webworker_importscripts } from './webworker.importscripts';

export const es2023_full: LibDefinition = {
  libs: [
    es2023,
    dom,
    webworker_importscripts,
    scripthost,
    dom_iterable,
    dom_asynciterable,
  ],
  variables: [],
};
