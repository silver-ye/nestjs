interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
}
export declare class PostsController {
    getPosts(): PostModel[];
    getPost(id: string): PostModel;
    postPosts(author: string, title: string, content: string): {
        id: number;
        author: string;
        title: string;
        content: string;
        likeCount: number;
        commentCount: number;
    };
    patchPost(id: string, author?: string, title?: string, content?: string): PostModel;
    deletePost(id: string): string;
}
export {};
