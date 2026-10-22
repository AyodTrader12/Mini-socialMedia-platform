"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = void 0;
const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};
const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => entities[c]);
exports.escapeHtml = escapeHtml;
