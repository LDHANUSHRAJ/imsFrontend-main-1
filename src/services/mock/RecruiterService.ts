
export const RecruiterService = {
    getAll: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: '1', companyName: 'Google', name: 'John Doe', email: 'john@google.com', createdAt: '2023-01-15', isActive: true },
                { id: '2', companyName: 'Microsoft', name: 'Jane Smith', email: 'jane@microsoft.com', createdAt: '2023-02-10', isActive: true },
                { id: '3', companyName: 'Amazon', name: 'Bob Johnson', email: 'bob@amazon.com', createdAt: '2023-03-05', isActive: false },
            ]), 600);
        });
    },

    toggleStatus: async (id: string) => {
        return new Promise((resolve) => setTimeout(resolve, 400));
    },

    create: async (data: any) => {
        return new Promise((resolve) => setTimeout(resolve, 800));
    }
};
