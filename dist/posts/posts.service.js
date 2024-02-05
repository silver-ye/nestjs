"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
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
let PostsService = class PostsService {
    getAllPosts() {
        return posts;
    }
    getPostById(postId) {
        const post = posts.find((post) => post.id == postId);
        if (!post) {
            throw new common_1.NotFoundException();
        }
        else {
            return post;
        }
    }
    creatPost(author, title, content) {
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
    updatePost(postId, author, title, content) {
        const post = posts.find((post) => post.id === postId);
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
        posts = posts.map((prevPost) => (prevPost.id === postId ? post : prevPost));
        return post;
    }
    deletePost(postId) {
        const post = posts.find((post) => post.id === postId);
        if (!post) {
            throw new common_1.NotFoundException();
        }
        posts = posts.filter((post) => post.id !== postId);
        return postId;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)()
], PostsService);
//# sourceMappingURL=posts.service.js.map