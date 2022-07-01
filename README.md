# filepond-plugin-file-validate-duration

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
