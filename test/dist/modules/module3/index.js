var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@modules/module3", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let Module3 = class Module3 extends components_1.Module {
        onShow(options) {
            this.lblId.caption = (options === null || options === void 0 ? void 0 : options.id) || "";
        }
        onHide() {
            console.log("module 3 hide");
        }
        render() {
            return this.$render("i-panel", null,
                this.$render("i-vstack", { margin: { top: '1rem', bottom: '1rem' } },
                    this.$render("i-label", { caption: 'Module 3!', font: { size: '1.5rem', bold: true } }),
                    this.$render("i-hstack", { verticalAlignment: 'center', gap: 4 },
                        this.$render("i-label", { caption: "id: " }),
                        this.$render("i-label", { id: "lblId" }))));
        }
    };
    Module3 = __decorate([
        components_1.customModule
    ], Module3);
    exports.default = Module3;
});
