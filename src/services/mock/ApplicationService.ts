// Temporary stub for ApplicationService until proper API integration
export const ApplicationService = {
    getAll: async () => {
        return [];
    },
    getById: async (id: string) => {
        return null;
    },
    updateStatus: async (id: string, status: string) => {
        console.log('ApplicationService.updateStatus called:', id, status);
        return { success: true };
    }
};
