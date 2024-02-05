export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
}
export declare class PostsService {
    getAllPosts(): PostModel[];
    getPostById(postId: number): PostModel;
    creatPost(author: string, title: string, content: string): {
        id: number;
        author: string;
        title: string;
        content: string;
        likeCount: number;
        commentCount: number;
    };
    updatePost(postId: number, author: string, title: string, content: string): PostModel;
    deletePost(postId: number): number;
}
