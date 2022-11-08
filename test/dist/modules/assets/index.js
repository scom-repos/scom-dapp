define("@modules/assets", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_1.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        logo: fullPath('img/logo.svg'),
        logoMobile: fullPath('img/logo-mobile.svg'),
        logoMobileDark: fullPath('img/logo-mobile-dark.svg'),
        fullPath
    };
});
