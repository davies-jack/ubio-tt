import { sharedConfigs } from '@nodescript/eslint-config';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    ...sharedConfigs,
    {
        files: ['**/*.ts'],
        plugins: {
            prettier: prettierPlugin
        },
    }
];
