define("@modules/assets", ["require", "exports", "@ijstech/components", "@ijstech/components"], function (require, exports, components_1, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_1.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        logo: {
            header: {
                desktop: fullPath('img/logo.svg'),
                tablet: {
                    light: fullPath('img/logo-mobile.svg'),
                    dark: fullPath('img/logo-mobile-dark.svg'),
                },
                mobile: {
                    light: fullPath('img/logo-mobile.svg'),
                    dark: fullPath('img/logo-mobile-dark.svg'),
                }
            },
            footer: {
                light: fullPath('img/logo-mobile.svg'),
                dark: fullPath('img/logo-mobile-dark.svg'),
            }
        },
        fullPath
    };
    components_2.Styles.fontFace({
        fontFamily: "Raleway",
        src: `url("${fullPath('fonts/raleway/Raleway-Black.ttf')}") format("truetype")`,
        fontWeight: '900',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Raleway",
        src: `url("${fullPath('fonts/raleway/Raleway-Bold.ttf')}") format("truetype")`,
        fontWeight: 'bold',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Raleway",
        src: `url("${fullPath('fonts/raleway/Raleway-Regular.ttf')}") format("truetype")`,
        fontWeight: '400',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Raleway",
        src: `url("${fullPath('fonts/raleway/Raleway-Italic.ttf')}") format("truetype")`,
        fontWeight: 'normal',
        fontStyle: 'italic'
    });
});
