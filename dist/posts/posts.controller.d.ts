import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postService;
    constructor(postService: PostsService);
    getPosts(): import("./posts.service").PostModel[];
    getPost(id: string): import("./posts.service").PostModel;
    postPosts(author: string, title: string, content: string): {
        id: number;
        author: string;
        title: string;
        content: string;
        likeCount: number;
        commentCount: number;
    };
    patchPost(id: string, author?: string, title?: string, content?: string): import("./posts.service").PostModel;
    deletePost(id: string): number;
}
