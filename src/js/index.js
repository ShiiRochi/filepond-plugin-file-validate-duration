const isVideo = file => /^video/.test(file.type);

const isAudio = file => /^audio/.test(file.type);

const isSet = (num) => typeof num !== "undefined" && num !== null && !isNaN(num);

const ERROR_TYPES = {
    LESS_THAN_MIN: 1,
    LONGER_THAN_MAX: 2
};

const plugin = ({ addFilter, utils }) => {
    // get quick reference to Type utils
    const { Type, replaceInString } = utils;

    const validateFile = (file, { minDuration, maxDuration } = {}) => {
        return new Promise((resolve, reject) => {
            let tag;

            if (isAudio(file)) {
                tag = "audio";
            } else if (isVideo(file)) {
                tag = "video";
            }

            const media$ = document.createElement(tag);

            media$.preload = "metadata";

            media$.onloadedmetadata = () => {
                const duration = media$.duration;

                URL.revokeObjectURL(media$.src);

                if (isSet(minDuration) && duration < minDuration) {
                    reject({ code: ERROR_TYPES.LESS_THAN_MIN, duration, minDuration });
                    return;
                }

                if (isSet(maxDuration) && duration > maxDuration) {
                    reject({ code: ERROR_TYPES.LONGER_THAN_MAX, duration, maxDuration });
                    return;
                }

                resolve();
            };

            media$.src = URL.createObjectURL(file);
        })
    };

    // filtering if an item is allowed in hopper
    addFilter('ALLOW_HOPPER_ITEM', (file, { query }) => {
        if (!query('GET_ALLOW_FILE_DURATION_VALIDATION')) {
            return true;
        }

        const maxDuration = query('GET_MAX_FILE_DURATION');
        const minDuration = query('GET_MIN_FILE_DURATION');

        return new Promise((resolve, reject) => {
            return validateFile(file, { maxDuration, minDuration }).then(() => {
                resolve(file);
            }).catch(error => {
                const onFileValidateDurationError = query("GET_ON_FILE_VALIDATE_DURATION_ERROR");

                if (onFileValidateDurationError) {
                    onFileValidateDurationError({ file, ...error });
                }

                reject(error);
            })
        })
    });

    // called for each file that is loaded
    // right before it is set to the item state
    // should return a promise
    addFilter(
        'LOAD_FILE',
        (file, { query }) => {
            return new Promise((resolve, reject) => {
                if (!query('GET_ALLOW_FILE_DURATION_VALIDATION')) {
                    return resolve(file);
                }

                const fileFilter = query('GET_FILE_VALIDATE_DURATION_FILTER');
                if (fileFilter && !fileFilter(file)) {
                    return resolve(file);
                }

                const maxDuration = query('GET_MAX_FILE_DURATION');
                const minDuration = query('GET_MIN_FILE_DURATION');
                return validateFile(file, {maxDuration, minDuration}).then(() => {
                    resolve(file);
                }).catch((error) => {

                    const { code, minDuration, maxDuration } = error;

                    // TODO: be carefull here
                    let main;
                    let sub;

                    if (code === ERROR_TYPES.LONGER_THAN_MAX) {
                        main = query('GET_LABEL_MAX_FILE_DURATION_EXCEEDED');
                        sub = replaceInString(query('GET_LABEL_MAX_FILE_DURATION'), {maxDuration});
                    } else if (code === ERROR_TYPES.LESS_THAN_MIN) {
                        main = query('GET_LABEL_MIN_FILE_DURATION_EXCEEDED');
                        sub = replaceInString(query('GET_LABEL_MIN_FILE_DURATION'), {minDuration});
                    }

                    const onFileValidateDurationError = query("GET_ON_FILE_VALIDATE_DURATION_ERROR");

                    if (onFileValidateDurationError) {
                        onFileValidateDurationError({ file, ...error });
                    }

                    reject({
                        status: {
                            main,
                            sub,
                        },
                    });
                });
            });
        }
    );

    return {
        options: {
            // Enable or disable file type validation
            allowFileDurationValidation: [false, Type.BOOLEAN],

            // Max individual file size in bytes
            maxFileDuration: [null, Type.INT],

            // Min individual file size in bytes
            minFileDuration: [null, Type.INT],

            // Filter the files that need to be validated for size
            fileValidateDurationFilter: [(file) => isAudio(file) || isVideo(file), Type.FUNCTION],
            onFileValidateDurationError: [null, Type.FUNCTION],

            // error labels
            labelMinFileDurationExceeded: ['File is too short', Type.STRING],
            labelMinFileDuration: ['Minimum file duration is {minDuration}', Type.STRING],

            labelMaxFileDurationExceeded: ['File is too long', Type.STRING],
            labelMaxFileDuration: ['Maximum file duration is {maxDuration}', Type.STRING],
        },
    };
};

// fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
if (isBrowser) {
    document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', { detail: plugin }));
}

export default plugin;
