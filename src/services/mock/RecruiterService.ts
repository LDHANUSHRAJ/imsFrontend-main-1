// Temporary stub for RecruiterService until proper API integration
export const RecruiterService = {
    getAll: async () => {
        return [];
    },
    create: async (data: any) => {
        console.log('RecruiterService.create called with:', data);
        return { id: 'temp-id', ...data };
    },
    toggleStatus: async (id: string) => {
        console.log('RecruiterService.toggleStatus called for:', id);
        return { success: true };
    }
};
