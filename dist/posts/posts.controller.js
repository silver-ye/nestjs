"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
let posts = [
    {
        id: 1,
        author: 'NestJS_official',
        title: 'Base of NestJS',
        content: 'How to use NestJS in service?',
        likeCount: 10000000,
        commentCount: 500000,
    },
    {
        id: 2,
        author: 'NestJS_official',
        title: 'Post of NestJS',
        content: 'How to use Post NestJS in service?',
        likeCount: 90000000,
        commentCount: 600000,
    },
    {
        id: 3,
        author: 'NestJS_official',
        title: 'Get of NestJS',
        content: 'How to use Get NestJS in service?',
        likeCount: 80000000,
        commentCount: 700000,
    },
];
let PostsController = class PostsController {
    getPosts() {
        return posts;
    }
    getPost(id) {
        const post = posts.find((post) => post.id == +id);
        if (!post) {
            throw new common_1.NotFoundException();
        }
        else {
            return post;
        }
    }
    postPosts(author, title, content) {
        const post = {
            id: posts[posts.length - 1].id + 1,
            author,
            title,
            content,
            likeCount: 0,
            commentCount: 0,
        };
        posts = [...posts, post];
        return post;
    }
    patchPost(id, author, title, content) {
        const post = posts.find((post) => post.id === +id);
        if (!post) {
            throw new common_1.NotFoundException();
        }
        if (author) {
            post.author = author;
        }
        if (title) {
            post.title = title;
        }
        if (content) {
            post.content = content;
        }
        posts = posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));
        return post;
    }
    deletePost(id) {
        const post = posts.find((post) => post.id === +id);
        if (!post) {
            throw new common_1.NotFoundException();
        }
        posts = posts.filter((post) => post.id !== +id);
        return id;
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "getPost", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('author')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "postPosts", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('author')),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "patchPost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "deletePost", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts')
], PostsController);
//# sourceMappingURL=posts.controller.js.map