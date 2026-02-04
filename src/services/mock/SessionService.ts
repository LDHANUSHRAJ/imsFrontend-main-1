// Temporary stub for SessionService until proper API integration
export const SessionService = {
    getAll: async () => {
        return [];
    },
    create: async (data: any) => {
        console.log('SessionService.create called with:', data);
        return { id: 'temp-id', ...data };
    },
    update: async (id: string, data: any) => {
        console.log('SessionService.update called:', id, data);
        return { id, ...data };
    },
    delete: async (id: string) => {
        console.log('SessionService.delete called:', id);
        return { success: true };
    }
};
