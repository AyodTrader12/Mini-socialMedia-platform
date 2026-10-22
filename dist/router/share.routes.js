"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const share_controller_1 = require("../controller/share.controller");
const router = (0, express_1.Router)();
router.get("/post/:id", share_controller_1.sharePostPage);
exports.default = router;
