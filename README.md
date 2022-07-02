# FilePond Plugin File Validate Duration

LiveDemo:

[<img src="https://img.shields.io/badge/Codesandbox-040404?style=for-the-badge&logo=codesandbox&logoColor=DBDBDB">](https://codesandbox.io/s/filepond-plugin-file-validate-duration-3gnegs)

Filepond plugin to validate media files duration. 
Inspired by `filepond-plugin-file-validate-size`.

Installation:
```shell
# NPM
npm i --save filepond-plugin-file-validate-duration

# YARN
yarn add filepond-plugin-file-validate-duration
```

Available options:
```ts
export interface FilePondOptions {
    allowFileDurationValidation?: boolean;
    minFileDuration?: string | null;
    maxFileDuration?: string | null;
    
    fileValidateDurationFilter?: (file: File) => boolean,
    
    /**
     * Callback that is called if error happens
     */
    onFileValidateDurationError?: ({ file: File, code: number }) => void,
    
    labelMinFileDurationExceeded?: string;
    labelMinFileDuration?: string;
    
    labelMaxFileDurationExceeded?: string;
    labelMaxFileDuration?: string;
}
```
