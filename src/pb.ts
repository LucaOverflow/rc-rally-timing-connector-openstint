import PocketBase from 'pocketbase';
import { pocketbaseUrl } from './params.js';

export const pb = new PocketBase(pocketbaseUrl);