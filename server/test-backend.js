import { generateLearningMaterial } from './src/services/geminiserver.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
    console.log('Testing from:', __dirname);
    try {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const result = await generateLearningMaterial(url);
        console.log('--- TEST RESULT ---');
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('--- TEST FAILED ---');
        console.error(err);
        if (err.stack) console.error(err.stack);
        process.exit(1);
    }
}

test();
