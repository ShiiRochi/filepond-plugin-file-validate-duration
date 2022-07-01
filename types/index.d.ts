// @ts-ignore
import { FilePondOptions } from "filepond";

declare module "filepond" {
  export interface FilePondOptions {
    /** Enable or disable file size validation. */
    allowFileDurationValidation?: boolean;
    /** The minimum size of a file, for instance 5MB or 750KB. */
    minFileDuration?: string | null;
    /** The maximum size of a file, for instance 5MB or 750KB. */
    maxFileDuration?: string | null;

    fileValidateDurationFilter?: (file: File) => boolean,

    /**
     * Callback that is called if error happens
     */
    onFileValidateDurationError?: ({ file: File, code: number }) => void,

    // error labels
    labelMinFileDurationExceeded?: string;
    labelMinFileDuration?: string;

    labelMaxFileDurationExceeded?: string;
    labelMaxFileDuration?: string;
  }
}
