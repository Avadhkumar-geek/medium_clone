export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    description: string!;
    slug: {
        current: string;
    };
    author: {
        name: string;
        image: {
            asset: {
                url: string;
            };
        };
    };
    comment: [Comment];
    mainImage: {
        asset: {
            url: string;
        };
    };
    body: [object!];
}

interface Comment {
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
    approved: true;
    comment: string;
    email: string;
    name: string;
    post: {
        _ref: string;
        _type: string;
    };
}
