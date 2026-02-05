import api from "./api";
import type { GuideAssignment, StudentProfileExtended, WeeklyLog, GuideFeedback } from "../types";

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const GuideService = {
    getAll: async (): Promise<GuideAssignment[]> => {
        // await new Promise(resolve => setTimeout(resolve, 600)); 
        // Mock data usually returns fast, but consistent with other services:
        await delay(600);

        // Mock response
        return [
            {
                id: '1',
                studentName: "Ananya Rao",
                studentRegNo: "2347112",
                internshipTitle: "Full Stack Developer Intern",
                companyName: "Infosys",
                status: "IN_PROGRESS",
                guide: "Dr. Prof. Guide",
                feedback: []
            },
            {
                id: '2',
                studentName: "Rahul Mehta",
                studentRegNo: "2347115",
                internshipTitle: "Data Analyst Intern",
                companyName: "Deloitte",
                status: "CLOSURE_SUBMITTED",
                guide: "Dr. Prof. Guide",
                feedback: []
            },
            {
                id: '3',
                studentName: "Karthik N",
                studentRegNo: "2347120",
                internshipTitle: "Software Engineer Intern",
                companyName: "Wipro",
                status: "OVERDUE_LOGS",
                guide: "Dr. Prof. Guide",
                feedback: []
            }
        ];
    },

    assignGuide: async (id: string, guideName: string) => {
        const response = await api.put(`/internships/${id}`, { guide: guideName });
        return response.data;
    },

    addFeedback: async (id: string, feedbackMsg: string) => {
        const current = await api.get(`/internships/${id}`);
        const currentFeedback = current.data.feedback || [];
        const newFeedback = {
            id: Date.now().toString(),
            message: feedbackMsg,
            date: new Date().toISOString().split('T')[0],
            guideName: 'Dr. Prof. Guide' // Mock
        };
        const updatedFeedback = [...currentFeedback, newFeedback];

        const response = await api.put(`/internships/${id}`, { feedback: updatedFeedback });
        return response.data;
    },

    updateFeedback: async (internshipId: string, feedbackId: string, newMessage: string) => {
        // Mock update behavior
        const current = await api.get(`/internships/${internshipId}`);
        const currentFeedback = current.data.feedback || [];

        const updatedFeedback = currentFeedback.map((f: any) =>
            f.id === feedbackId ? { ...f, message: newMessage } : f
        );

        const response = await api.put(`/internships/${internshipId}`, { feedback: updatedFeedback });
        return response.data;
    },

    // --- New Methods for Enhanced Portal ---

    getStudentDetails: async (id: string): Promise<StudentProfileExtended> => {
        await delay(500);
        // Mock data based on ID
        return {
            id,
            studentName: id === '2' ? "Rahul Mehta" : "Ananya Rao",
            studentRegNo: id === '2' ? "2347115" : "2347112",
            email: id === '2' ? "rahul.mehta@mba.christuniversity.in" : "ananya.rao@mca.christuniversity.in",
            phone: "+91 9876543210",
            department: "Computer Science",
            internshipTitle: id === '2' ? "Data Analyst Intern" : "Full Stack Developer Intern",
            companyName: id === '2' ? "Deloitte" : "Infosys",
            status: id === '2' ? "CLOSURE_SUBMITTED" : "IN_PROGRESS",
            startDate: "2024-01-10",
            endDate: "2024-06-10",
            logs: [],
            feedback: []
        };
    },

    getStudentLogs: async (_studentId: string): Promise<WeeklyLog[]> => {
        await delay(500);
        return [
            {
                id: 'log-1',
                weekNumber: 1,
                startDate: '2024-01-10',
                endDate: '2024-01-17',
                workSummary: 'Onboarding and setup. Met with the team and understood the project requirements.',
                learningOutcomes: 'Company policies, environment setup, Agile methodology.',
                status: 'APPROVED',
                submissionDate: '2024-01-17',
                guideComments: 'Good start. Keep it up.'
            },
            {
                id: 'log-2',
                weekNumber: 2,
                startDate: '2024-01-18',
                endDate: '2024-01-25',
                workSummary: 'Frontend development with React. Created the initial layout and navigation.',
                learningOutcomes: 'React hooks, Tailwind CSS, Responsive design.',
                status: 'PENDING',
                submissionDate: '2024-01-25'
            },
            {
                id: 'log-3',
                weekNumber: 3,
                startDate: '2024-01-26',
                endDate: '2024-02-02',
                workSummary: 'Backend API integration. Connected the frontend to the Node.js backend.',
                learningOutcomes: 'REST APIs, Axios, Error handling.',
                status: 'SUBMITTED', // Just submitted, needs review
                submissionDate: '2024-02-02'
            }
        ];
    },

    updateLogStatus: async (logId: string, status: 'APPROVED' | 'REJECTED', comments?: string) => {
        await delay(500);
        console.log(`Updated log ${logId} to ${status} with comments: ${comments}`);
        return { success: true, status, comments };
    },

    submitFeedback: async (studentId: string, feedback: GuideFeedback) => {
        await delay(800);
        console.log(`Submitted feedback for ${studentId}:`, feedback);
        return { success: true };
    },

    updateInternshipStatus: async (studentId: string, status: string, reason?: string) => {
        await delay(800);
        console.log(`Updated internship ${studentId} to ${status}. Reason: ${reason}`);
        return { success: true, status };
    }
};
